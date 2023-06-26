/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
const connexion = require('../../../db-config');
const database = connexion.promise();

const getOne = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query('select * from track where id = ?', [id])
    .then(([track]) => {
      if (track[0] != null) {
        res.status(200).json(track[0]);
      } else {
        res.status(404).send('Not Found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const getAll = (req, res) => {
  database
    .query('select * from track')
    .then(([track]) => {
      res.status(200).json(track);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};
const postTracks = (req, res) => {
  const { title, youtube_url, id_album } = req.body;
  database
    .query('INSERT INTO track(title, youtube_url,id_album )VALUES (?,?,?)', [
      title,
      youtube_url,
      id_album,
    ])
    .then(([result]) => {
      const newTrack = { id: result.insertId, title, youtube_url, id_album };
      res.status(201).json(newTrack);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error saving the track');
    });
};

const updateTracks = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, youtube_url, id_album } = req.body;
  if (!id_album) {
    res.status(400).send('id_album is required');
    return;
  }
  database
    .query(
      'UPDATE track SET title = ?, youtube_url = ?, id_album = ? WHERE id = ?',
      [title, youtube_url, id_album, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not Found');
      } else {
        res.status(204).send('No Content');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error editing the track');
    });
};

const deleteTracks = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query('DELETE from track where id=?', [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not Found');
      } else {
        res.status(204).send('no content');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error deleting the track');
    });
};

module.exports = { getOne, getAll, postTracks, updateTracks, deleteTracks };
