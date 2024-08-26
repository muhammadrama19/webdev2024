import React, { useState } from "react";
import Autocomplete from "react-autocomplete";
import "../styles/inputActor.css";

const InputActor = ({ actorsList, selectedActors, onActorChange }) => {
  const [value, setValue] = useState("");

  const handleSearchChange = (e) => {
    setValue(e.target.value); // Update nilai input saat pengguna mengetik
  };

  // Filter aktor hanya jika input tidak kosong
  const filteredActors = value
    ? actorsList.filter((actor) =>
        actor.name.toLowerCase().includes(value.toLowerCase())
      )
    : [];

  return (
    <div className="input-actor-group">
      <label>Add Actors (Up to 10)</label>
      <div className="autocomplete-wrapper"> 
        <Autocomplete
          getItemValue={(item) => item.name}
          items={filteredActors}
          renderItem={(item, isHighlighted) => (
            <div
              key={item.name}
              style={{ background: isHighlighted ? "" : "" }}
            >
              {item.name}
            </div>
          )}
          value={value}
          onChange={handleSearchChange}
          onSelect={(val) => {
            setValue("");
            const selectedActor = actorsList.find(actor => actor.name === val);
            onActorChange(selectedActor); // Panggil handler untuk menambahkan aktor ke daftar
          }}
          inputProps={{
            placeholder: "Search Actor Names",
            className: "actor-search-input"
          }}
        />
      </div>

      {/* Tampilkan pesan jika tidak ada aktor yang dipilih */}
      {selectedActors.length === 0 ? (
        <div className="no-actors-selected">
          Belum ada aktor yang dipilih
        </div>
      ) : (
        <div className="actors-checkbox-group">
          {selectedActors.map((actor, index) => (
            <div key={index} className="actor-display">
              <img src={actor.image} alt={actor.name} className="actor-image" />
              <label className="actor-checkbox">
                <input
                  type="checkbox"
                  value={actor.name}
                  onChange={() => onActorChange(actor)}
                  checked={selectedActors.some((a) => a.name === actor.name)}
                />
                {actor.name.length > 10
                  ? actor.name.substring(0, 10) + "..."
                  : actor.name}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputActor;
