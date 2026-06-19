const fs = require('fs');
const path = require('path');

class Statement {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
  }

  run(...params) {
    return this.db._executeQuery(this.sql, params, 'run');
  }

  get(...params) {
    return this.db._executeQuery(this.sql, params, 'get');
  }

  all(...params) {
    return this.db._executeQuery(this.sql, params, 'all');
  }
}

class Database {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.tables = {
      users: [],
      categories: [],
      products: [],
      cart: [],
      orders: [],
      contact_messages: []
    };
    this.counters = {
      users: 0,
      categories: 0,
      products: 0,
      cart: 0,
      orders: 0,
      contact_messages: 0
    };
    
    this.jsonPath = dbPath.replace('.db', '.json');
    this.load();
  }

  load() {
    if (fs.existsSync(this.jsonPath)) {
      try {
        const raw = fs.readFileSync(this.jsonPath, 'utf8');
        const data = JSON.parse(raw);
        if (data.tables && data.counters) {
          this.tables = data.tables;
          this.counters = data.counters;
        }
      } catch (err) {
        console.error('Failed to load mock database:', err);
      }
    }
  }

  save() {
    try {
      fs.writeFileSync(this.jsonPath, JSON.stringify({
        tables: this.tables,
        counters: this.counters
      }, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to save mock database:', err);
    }
  }

  pragma(str) {
    return this;
  }

  exec(sql) {
    return this;
  }

  prepare(sql) {
    return new Statement(this, sql);
  }

  transaction(fn) {
    return (...args) => {
      const backupTables = JSON.parse(JSON.stringify(this.tables));
      const backupCounters = JSON.parse(JSON.stringify(this.counters));
      try {
        const result = fn(...args);
        this.save();
        return result;
      } catch (err) {
        this.tables = backupTables;
        this.counters = backupCounters;
        throw err;
      }
    };
  }

  close() {
    this.save();
  }

  _evalWhere(row, whereClause, whereParams) {
    const parts = whereClause.split(/\s+AND\s+/i);
    let paramIdx = 0;
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      if (trimmed === '1=1') continue;
      
      const match = trimmed.match(/([\w.]+)\s*(=|!=|<>|<|>|<=|>=)\s*(\?|'[^']*'|\d+)/i);
      if (match) {
        let col = match[1].toLowerCase();
        if (col.includes('.')) {
          col = col.split('.')[1];
        }
        
        const op = match[2];
        const valStr = match[3];
        
        let val;
        if (valStr === '?') {
          val = whereParams[paramIdx++];
        } else if (valStr.startsWith("'")) {
          val = valStr.substring(1, valStr.length - 1);
        } else {
          val = Number(valStr);
        }
        
        const rowVal = row[col];
        
        let result = false;
        if (op === '=') {
          result = (String(rowVal) == String(val));
        } else if (op === '!=' || op === '<>') {
          result = (String(rowVal) != String(val));
        } else if (op === '<') {
          result = (Number(rowVal) < Number(val));
        } else if (op === '>') {
          result = (Number(rowVal) > Number(val));
        } else if (op === '<=') {
          result = (Number(rowVal) <= Number(val));
        } else if (op === '>=') {
          result = (Number(rowVal) >= Number(val));
        }
        
        if (!result) return false;
      } else {
        if (trimmed === '1=1') {
          // No-op
        } else if (trimmed.includes('LIKE')) {
          if (trimmed.includes('OR')) {
            const term1 = whereParams[paramIdx++];
            const term2 = whereParams[paramIdx++];
            const cleanTerm = (term1 || '').replace(/%/g, '').toLowerCase();
            
            const nameMatch = String(row.name || '').toLowerCase().includes(cleanTerm);
            const descMatch = String(row.description || '').toLowerCase().includes(cleanTerm);
            
            if (!nameMatch && !descMatch) return false;
          } else {
            const term = whereParams[paramIdx++];
            const cleanTerm = (term || '').replace(/%/g, '').toLowerCase();
            const matchCol = trimmed.split(/\s+/)[0].replace(/.*\./, '').toLowerCase();
            const rowVal = String(row[matchCol] || '').toLowerCase();
            
            if (!rowVal.includes(cleanTerm)) return false;
          }
        }
      }
    }
    return true;
  }

  _executeQuery(sql, params, type) {
    const cleanedSql = sql.replace(/\s+/g, ' ').trim();
    
    // 1. INSERT query
    if (cleanedSql.toUpperCase().startsWith('INSERT')) {
      const insertMatch = cleanedSql.match(/INSERT INTO (\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
      if (insertMatch) {
        const tableName = insertMatch[1].toLowerCase();
        const columns = insertMatch[2].split(',').map(c => c.trim().toLowerCase());
        
        const newId = ++this.counters[tableName];
        const newRow = { id: newId };
        
        if (tableName === 'users') {
          newRow.role = 'user';
          newRow.created_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
        } else if (tableName === 'products') {
          newRow.stock = 0;
          newRow.rating = 0;
          newRow.created_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
        } else if (tableName === 'cart') {
          newRow.quantity = 1;
        } else if (tableName === 'orders') {
          newRow.status = 'pending';
          newRow.created_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
        } else if (tableName === 'contact_messages' || tableName === 'categories') {
          newRow.created_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
        }
        
        columns.forEach((col, idx) => {
          newRow[col] = params[idx];
        });
        
        this.tables[tableName].push(newRow);
        this.save();
        return { lastInsertRowid: newId, changes: 1 };
      }
    }
    
    // 2. UPDATE query
    if (cleanedSql.toUpperCase().startsWith('UPDATE')) {
      const updateMatch = cleanedSql.match(/UPDATE (\w+)\s+SET\s+(.+?)\s+WHERE\s+(.+)/i);
      if (updateMatch) {
        const tableName = updateMatch[1].toLowerCase();
        const setClause = updateMatch[2];
        const whereClause = updateMatch[3];
        
        const setParts = setClause.split(',').map(p => p.trim());
        const setParamCount = (setClause.match(/\?/g) || []).length;
        const setParams = params.slice(0, setParamCount);
        const whereParams = params.slice(setParamCount);
        
        let changes = 0;
        this.tables[tableName] = this.tables[tableName].map(row => {
          if (this._evalWhere(row, whereClause, whereParams)) {
            changes++;
            const updatedRow = { ...row };
            
            let pIdx = 0;
            setParts.forEach(part => {
              const eqIdx = part.indexOf('=');
              const col = part.substring(0, eqIdx).trim().toLowerCase();
              const valExpr = part.substring(eqIdx + 1).trim();
              
              if (valExpr.toUpperCase().startsWith('COALESCE')) {
                const val = setParams[pIdx++];
                if (val !== undefined && val !== null) {
                  updatedRow[col] = val;
                }
              } else if (valExpr.includes('+') || valExpr.includes('-')) {
                const isAdd = valExpr.includes('+');
                const val = setParams[pIdx++];
                const currentVal = Number(updatedRow[col]) || 0;
                updatedRow[col] = isAdd ? currentVal + Number(val) : currentVal - Number(val);
              } else {
                const val = setParams[pIdx++];
                updatedRow[col] = val;
              }
            });
            return updatedRow;
          }
          return row;
        });
        
        this.save();
        return { changes };
      }
    }
    
    // 3. DELETE query
    if (cleanedSql.toUpperCase().startsWith('DELETE')) {
      const deleteMatch = cleanedSql.match(/DELETE FROM (\w+)(?:\s+WHERE\s+(.+))?/i);
      if (deleteMatch) {
        const tableName = deleteMatch[1].toLowerCase();
        const whereClause = deleteMatch[2];
        
        const initialLength = this.tables[tableName].length;
        if (!whereClause) {
          this.tables[tableName] = [];
        } else {
          this.tables[tableName] = this.tables[tableName].filter(row => {
            return !this._evalWhere(row, whereClause, params);
          });
        }
        
        const changes = initialLength - this.tables[tableName].length;
        this.save();
        return { changes };
      }
    }
    
    // 4. SELECT query
    if (cleanedSql.toUpperCase().startsWith('SELECT')) {
      const fromMatch = cleanedSql.match(/FROM\s+(\w+)/i);
      if (!fromMatch) {
        throw new Error('Could not identify table in query: ' + sql);
      }
      const tableName = fromMatch[1].toLowerCase();
      let list = [...(this.tables[tableName] || [])];
      if (process.env.DEBUG_SQL) {
        console.log('SELECT query debug:', { tableName, initialLength: list.length, sql: cleanedSql });
      }
      
      const whereMatch = cleanedSql.match(/WHERE\s+(.+?)(?:\s+GROUP\s+BY|\s+ORDER\s+BY|\s+LIMIT|\s+OFFSET|$)/i);
      if (whereMatch) {
        const whereClause = whereMatch[1];
        let whereParams = [...params];
        let limitVal = null;
        let offsetVal = null;
        
        const limitMatch = cleanedSql.match(/LIMIT\s+(\?|\d+)/i);
        const offsetMatch = cleanedSql.match(/OFFSET\s+(\?|\d+)/i);
        
        if (limitMatch) {
          if (limitMatch[1] === '?') {
            limitVal = params[params.length - (offsetMatch && offsetMatch[1] === '?' ? 2 : 1)];
          } else {
            limitVal = Number(limitMatch[1]);
          }
        }
        if (offsetMatch) {
          if (offsetMatch[1] === '?') {
            offsetVal = params[params.length - 1];
          } else {
            offsetVal = Number(offsetMatch[1]);
          }
        }
        
        let sliceCount = 0;
        if (limitMatch && limitMatch[1] === '?') sliceCount++;
        if (offsetMatch && offsetMatch[1] === '?') sliceCount++;
        if (sliceCount > 0) {
          whereParams = params.slice(0, params.length - sliceCount);
        }
        
        list = list.filter(row => this._evalWhere(row, whereClause, whereParams));
      }
      
      if (tableName === 'products' && cleanedSql.includes('JOIN categories')) {
        list = list.map(product => {
          const category = this.tables.categories.find(c => c.id === product.category_id);
          return {
            ...product,
            category_name: category ? category.name : null
          };
        });
      }
      
      if (tableName === 'cart' && cleanedSql.includes('JOIN products')) {
        list = list.map(item => {
          const product = this.tables.products.find(p => p.id === item.product_id);
          if (product) {
            return {
              id: item.id,
              quantity: item.quantity,
              product_id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              stock: product.stock,
              user_id: item.user_id
            };
          }
          return null;
        }).filter(Boolean);
      }
      
      if (tableName === 'orders' && cleanedSql.includes('JOIN users')) {
        list = list.map(order => {
          const user = this.tables.users.find(u => u.id === order.user_id);
          return {
            ...order,
            user_name: user ? user.name : null,
            user_email: user ? user.email : null
          };
        });
      }
      
      if (cleanedSql.includes('COUNT(p.id) as product_count')) {
        list = list.map(cat => {
          const count = this.tables.products.filter(p => p.category_id === cat.id).length;
          return {
            ...cat,
            product_count: count
          };
        });
      }
      
      if (cleanedSql.toUpperCase().includes('COUNT(*)')) {
        const countMatch = cleanedSql.match(/COUNT\(\*\)\s+as\s+(\w+)/i);
        const alias = countMatch ? countMatch[1] : 'count';
        const result = { [alias]: list.length };
        return type === 'get' ? result : [result];
      }
      
      if (cleanedSql.includes('SUM(total)')) {
        const sum = list.reduce((s, row) => s + (row.total || 0), 0);
        const result = { revenue: sum };
        return type === 'get' ? result : [result];
      }
      
      if (cleanedSql.includes('GROUP BY status')) {
        const counts = {};
        list.forEach(row => {
          counts[row.status] = (counts[row.status] || 0) + 1;
        });
        return Object.entries(counts).map(([status, count]) => ({ status, count }));
      }
      
      const orderMatch = cleanedSql.match(/ORDER\s+BY\s+([\w.]+)\s+(ASC|DESC)/i);
      if (orderMatch) {
        let field = orderMatch[1].replace(/.*\./, '').toLowerCase();
        const dir = orderMatch[2].toUpperCase();
        
        list.sort((a, b) => {
          let valA = a[field];
          let valB = b[field];
          if (field === 'price' || field === 'rating' || field === 'stock') {
            valA = Number(valA) || 0;
            valB = Number(valB) || 0;
          } else {
            valA = String(valA || '');
            valB = String(valB || '');
          }
          if (valA < valB) return dir === 'ASC' ? -1 : 1;
          if (valA > valB) return dir === 'ASC' ? 1 : -1;
          return 0;
        });
      }
      
      let limitVal = null;
      let offsetVal = null;
      
      const limitMatch = cleanedSql.match(/LIMIT\s+(\?|\d+)/i);
      const offsetMatch = cleanedSql.match(/OFFSET\s+(\?|\d+)/i);
      
      if (limitMatch) {
        if (limitMatch[1] === '?') {
          limitVal = params[params.length - (offsetMatch && offsetMatch[1] === '?' ? 2 : 1)];
        } else {
          limitVal = Number(limitMatch[1]);
        }
      }
      if (offsetMatch) {
        if (offsetMatch[1] === '?') {
          offsetVal = params[params.length - 1];
        } else {
          offsetVal = Number(offsetMatch[1]);
        }
      }
      
      if (offsetVal !== null) {
        list = list.slice(offsetVal);
      }
      if (limitVal !== null) {
        list = list.slice(0, limitVal);
      }
      
      if (type === 'get') {
        return list[0] ? JSON.parse(JSON.stringify(list[0])) : undefined;
      }
      return JSON.parse(JSON.stringify(list));
    }
  }
}

module.exports = Database;
