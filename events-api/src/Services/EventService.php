<?php

namespace App\Services;

class EventService
{
    protected \SQLite3 $db;

    public function __construct()
    {
        $this->db = new \SQLite3(__DIR__ . '/../../../database.db');
    }

    public function getAll(): array
    {
        $result = $this->db->query('SELECT * FROM events');
        $events = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $events[] = $row;
        }
        return $events;
    }

    public function getById($id)
    {
        $stmt = $this->db->prepare('SELECT * FROM events WHERE id = :id');
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        return $stmt->execute()->fetchArray(SQLITE3_ASSOC);
    }

    public function create(array $data): array
    {
        if (empty($data['name']) || empty($data['description']) || empty($data['date'])) {
            throw new \Exception('Missing required fields');
        }

        $stmt = $this->db->prepare('INSERT INTO events (name, description, date) VALUES (:name, :description, :date)');
        $stmt->bindValue(':name', $data['name']);
        $stmt->bindValue(':description', $data['description']);
        $stmt->bindValue(':date', $data['date']);
        $stmt->execute();

        return ['id' => $this->db->lastInsertRowID(), ...$data];
    }

    public function update($id, $data)
    {
        $statement = $this->db->prepare("UPDATE events SET name = :name, description = :description, date = :date WHERE id = :id");

        $statement->bindValue(':name', $data['name'], SQLITE3_TEXT);
        $statement->bindValue(':description', $data['description'], SQLITE3_TEXT);
        $statement->bindValue(':date', $data['date'], SQLITE3_TEXT);
        $statement->bindValue(':id', $id, SQLITE3_INTEGER);

        $result = $statement->execute();

        if ($result && $this->db->changes() > 0) {
            return [
                'id' => $id,
                'name' => $data['name'],
                'description' => $data['description'],
                'date' => $data['date']
            ];
        }

        return false;
    }

    public function delete($id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM events WHERE id = :id');
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $stmt->execute();
        return $this->db->changes() > 0;
    }
}
