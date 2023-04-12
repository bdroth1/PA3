using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace MusicLibrary.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SongsController : ControllerBase
    {
        private static readonly List<Song> _songs = new List<Song>();

        // GET /songs
        [HttpGet]
        public IEnumerable<Song> Get()
        {
            return _songs;
        }

        // POST /songs
        [HttpPost]
        public IActionResult Post([FromBody] Song song)
        {
            song.Id = Guid.NewGuid().ToString();
            song.DateAdded = DateTime.UtcNow;
            _songs.Add(song);
            return CreatedAtAction(nameof(GetSongById), new { id = song.Id }, song);
        }

        // GET /songs/{id}
        [HttpGet("{id}")]
        public IActionResult GetSongById(string id)
        {
            var song = _songs.Find(s => s.Id == id);
            if (song == null)
            {
                return NotFound();
            }
            return Ok(song);
        }

        // PUT /songs/{id}
        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody] Song updatedSong)
        {
            var index = _songs.FindIndex(s => s.Id == id);
            if (index == -1)
            {
                return NotFound();
            }
            _songs[index] = updatedSong;
            return NoContent();
        }

        // DELETE /songs/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var index = _songs.FindIndex(s => s.Id == id);
            if (index == -1)
            {
                return NotFound();
            }
            _songs.RemoveAt(index);
            return NoContent();
        }
    }

    public class Song
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Author { get; set; }
        public DateTime DateAdded { get; set; }
        public bool Favorited { get; set; }
        public bool Deleted { get; set; }
    }
}
