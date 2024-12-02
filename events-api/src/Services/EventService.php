<?php

namespace App\Services;

class EventService
{
    protected \SQLite3 $db;

    public function __construct()
    {
        $this->db = new \SQLite3(__DIR__ . '/../../database.db');
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

        $stmt = $this->db->prepare('INSERT INTO events (name, description, date, participants, cert_template_id) VALUES (:name, :description, :date, :participants, :cert_template_id)');
        $stmt->bindValue(':name', $data['name']);
        $stmt->bindValue(':description', $data['description']);
        $stmt->bindValue(':date', $data['date']);
        $stmt->bindValue(':participants', $data['participants']);
        $stmt->bindValue(':cert_template_id', $data['cert_template_id']);
        $stmt->execute();

        return ['id' => $this->db->lastInsertRowID(), ...$data];
    }

    public function update($id, $data)
    {
        $statement = $this->db->prepare("UPDATE events SET name = :name, description = :description, date = :date, participants = :participants, cert_template_id = :cert_template_id WHERE id = :id");

        $statement->bindValue(':name', $data['name'], SQLITE3_TEXT);
        $statement->bindValue(':description', $data['description'], SQLITE3_TEXT);
        $statement->bindValue(':date', $data['date'], SQLITE3_TEXT);
        $statement->bindValue(':participants', $data['participants'], SQLITE3_NUM);
        $statement->bindValue(':cert_template_id', $data['cert_template_id'], SQLITE3_INTEGER);
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

    public function getAllRegistrations(): array
    {
        $result = $this->db->query('SELECT * FROM event_users');
        $events = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $events[] = $row;
        }
        return $events;
    }

    public function getRegistrationById($id)
    {
        $stmt = $this->db->prepare('SELECT * FROM event_users WHERE id = :id');
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        return $stmt->execute()->fetchArray(SQLITE3_ASSOC);
    }

    public function getRegistrationsByUserId($id): array
    {
        $stmt = $this->db->prepare('
            SELECT 
                event_users.id AS registration_id, 
                events.*, 
                event_users.status 
            FROM event_users 
            JOIN events ON event_users.event_id = events.id 
            WHERE event_users.user_id = :id
        ');
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $result = $stmt->execute();
        $registrations = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $registrations[] = $row;
        }
        return $registrations;
    }

    public function getRegistrationsByEventId($id): array
    {
        $stmt = $this->db->prepare('SELECT * FROM event_users WHERE event_id = :id');
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $result = $stmt->execute();
        $registrations = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $registrations[] = $row;
        }
        return $registrations;
    }

    public function createRegistration(array $data): array
    {
        if (empty($data['event_id']) || empty($data['user_id']) || empty($data['status'])) {
            throw new \Exception('Missing required fields');
        }

        $checkStmt = $this->db->prepare('SELECT COUNT(*) as count FROM event_users WHERE event_id = :event_id AND user_id = :user_id');
        $checkStmt->bindValue(':event_id', $data['event_id'], SQLITE3_INTEGER);
        $checkStmt->bindValue(':user_id', $data['user_id'], SQLITE3_INTEGER);
        $result = $checkStmt->execute()->fetchArray(SQLITE3_ASSOC);

        if ($result['count'] > 0) {
            throw new \Exception('User is already registered for this event');
        }

        $stmt = $this->db->prepare('INSERT INTO event_users (event_id, user_id, status) VALUES (:event_id, :user_id, :status)');
        $stmt->bindValue(':event_id', $data['event_id']);

        $stmt->bindValue(':user_id', $data['user_id']);
        $stmt->bindValue(':status', $data['status']);
        $stmt->execute();

        return ['id' => $this->db->lastInsertRowID(), ...$data];
    }

    public function deleteRegistration($id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM event_users WHERE id = :id');
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $stmt->execute();
        return $this->db->changes() > 0;
    }

    public function registerPresence($id): bool
    {
        $stmt = $this->db->prepare("UPDATE event_users SET status = :status WHERE id = :id");
        $stmt->bindValue(':status', "checked-in", SQLITE3_TEXT);
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $stmt->execute();
        return $this->db->changes() > 0;
    }

    public function cancelRegistration($id): bool
    {
        $stmt = $this->db->prepare("UPDATE event_users SET status = :status WHERE id = :id");
        $stmt->bindValue(':status', "canceled", SQLITE3_TEXT);
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $stmt->execute();
        return $this->db->changes() > 0;
    }

    public function finishEvent($id): bool
    {
        $stmt = $this->db->prepare("UPDATE event_users SET status = 'canceled' WHERE event_id = :id AND status = 'registered';");
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $stmt->execute();
        return $this->db->changes() > 0;
    }
}
