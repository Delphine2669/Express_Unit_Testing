/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
const connexion = require('../../../db-config');
const database = connexion.promise();

const getAll = (req, res) => {
  database
    .query('select * from albums')
    .then(([albums]) => {
      res.status(200).json(albums);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.error(err);
    });
};

const getOne = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query('select * from albums where id = ?', [id])
    .then(([albums]) => {
      if (albums[0] != null) {
        res.status(200).json(albums[0]);
      } else {
        res.status(404).send('Not Found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const getTracksByAlbumId = (req, res) => {
  const albumId = req.params.album_Id;
  database
    .query(
      'SELECT track.id, track.title, track.youtube_url, track.id_album FROM track WHERE track.id_album = ?',
      [albumId]
    )
    .then((tracks) => {
      res.status(200).json(tracks);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving tracks by album ID');
    });
};

const postAlbums = (req, res) => {
  const { title, genre, picture, artist } = req.body;
  database
    .query(
      'INSERT INTO albums(title, genre, picture, artist)VALUES (?,?,?,?)',
      [title, genre, picture, artist]
    )
    .then(([result]) => {
      const newAlbum = { id: result.insertId, title, genre, picture, artist };
      res.status(201).json(newAlbum);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error saving the album');
    });
};

const updateAlbums = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, genre, picture, artist } = req.body;
  database
    .query(
      'UPDATE albums SET title = ?, genre = ?, picture = ?, artist = ? WHERE id = ? ',
      [title, genre, picture, artist, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not Found');
      } else {
        res.status(204).send('no content');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error editing the album');
    });
};

const deleteAlbums = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query('DELETE from albums where id=?', [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not Found');
      } else {
        res.status(204).send('no content');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error deleting the album');
    });
};

module.exports = {
  getAll,
  getOne,
  getTracksByAlbumId,
  postAlbums,
  updateAlbums,
  deleteAlbums,
};
