import fs from 'fs';

const DB_PATH = './database.json'

export function save(item) {
  return new Promise((resolve, reject) =>{
    load().then(data => {
      item.id = `${data.length + 1}`
      data.push(item)
      fs.writeFile(DB_PATH, JSON.stringify(data), (err) => {
        if (err) reject(err)
        else {
          resolve(data)
        }
      })
    })
  })
}

export function load() {
  return new Promise((resolve, reject) => {
    fs.readFile(DB_PATH, 'utf8', (err, data) =>{
      if(err) reject(err);
      else resolve(JSON.parse(data));
    })
  })
}