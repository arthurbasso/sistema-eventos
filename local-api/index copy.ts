import express, { type Request, type Response } from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const db = new sqlite3.Database('../databaseLocal.db');

app.use(express.json());

app.post('/users', (req: Request, res: Response) => {
    const { name, email, password } = req.body; // Adicione 'password' ao desestruturar
    const stmt = db.prepare('INSERT INTO users (name, email, password, synchronized) VALUES (?, ?, ?, false)');
    stmt.run(name, email, password, function (this: sqlite3.RunResult, err: unknown) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao criar usuário' });
      }
      res.status(201).json({ id: this.lastID, name, email });
    });
});
  
app.get('/users', (req: Request, res: Response) => {
    db.all('SELECT * FROM users', (err: unknown, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar usuários' });
      }
      res.json(rows);
    });
  });
  
app.get('/users/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.get('SELECT * FROM users WHERE id = ?', [id], (err: unknown, row) => {
      if (err || !row) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.json(row);
    });
});

app.get('/events', (req: Request, res: Response) => {
  db.all('SELECT * FROM events', (err: unknown, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar eventos' });
    }
    res.json(rows);
  });
});

app.get('/events/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.get('SELECT * FROM events WHERE id = ?', [id], (err: unknown, row) => {
    if (err || !row) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    res.json(row);
  });
});

app.get('/registers', (req: Request, res: Response) => {
    db.all('SELECT * FROM registers', (err: unknown, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar registros' });
      }
      res.json(rows);
    });
  });
  
  app.get('/registers/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.get('SELECT * FROM registers WHERE id = ?', [id], (err: unknown, row) => {
      if (err || !row) {
        return res.status(404).json({ error: 'Registro não encontrado' });
      }
      res.json(row);
    });
  });
  
  app.get('/registers/user/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.all('SELECT * FROM registers WHERE user_id = ?', [id], (err: unknown, rows) => {
      if (err || rows.length === 0) {
        return res.status(404).json({ error: 'Nenhum registro encontrado para este usuário' });
      }
      res.json(rows);
    });
  });
  
  app.delete('/registers/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.run('DELETE FROM registers WHERE id = ?', [id], function (this: sqlite3.RunResult, err: unknown) {
      if (err || this.changes === 0) {
        return res.status(404).json({ error: 'Registro não encontrado ou erro ao deletar' });
      }
      res.status(204).send();
    });
  });
  
  app.put('/checkin', (req: Request, res: Response) => {
    const { id } = req.body;
    
    db.run('UPDATE registers SET category = "checked-in" WHERE id = ?', [id], function (this: sqlite3.RunResult, err: unknown) {
      if (err || this.changes === 0) {
        return res.status(400).json({ error: 'Erro ao registrar presença' });
      }
      res.status(200).json({ success: true });
    });
  });
  
  app.post('/registers', (req: Request, res: Response) => {
    const { user_id, category, date } = req.body;
  
    // Definindo "synchronized" como false por padrão
    const stmt = db.prepare('INSERT INTO registers (user_id, category, date, synchronized) VALUES (?, ?, ?, false)');
    stmt.run(user_id, category, date, function (this: sqlite3.RunResult, err: unknown) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao criar registro' });
      }
      res.status(201).json({ id: this.lastID, user_id, category, date, synchronized: false });
    });
  });  

app.listen(3006, () => {
  console.log('Servidor rodando na porta 3006');
});