import { TextInput } from '@mantine/core';
import { Autocomplete } from '@react-google-maps/api';
import { ReactNode, useState } from 'react';


interface Place {
  formatted_address: string;
  name: string;
  place_id: string;
  latitude: number;
  longitude: number;
}

interface GooglePlacesAutocompleteProps {
  onSelect: (place: Place) => void;
  error: ReactNode;
  label: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
}

export default function GooglePlacesAutocomplete({
  onSelect, error, label, location
}: GooglePlacesAutocompleteProps) {
  const [value, setValue] = useState('');
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autoC: google.maps.places.Autocomplete) =>
    setAutocomplete(autoC);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      // console.log(place);

      if (place.geometry && place.geometry.location) {
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

        const selectedPlace: Place = {
          formatted_address: place.formatted_address || '',
          name: place.name || '',
          place_id: place.place_id || '',
          latitude,
          longitude,
        };

        setValue(place.name + ", " + place.formatted_address);

        onSelect(selectedPlace);
      } else {
        console.error('Place geometry is not available');
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };


  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <TextInput
        label={label}
        placeholder="Search for a location"
        value={value.length > 0 ? value : location.address}
        onChange={(e) => { 
          setValue(e.target.value); 
          const selectedPlace: Place = {
            formatted_address:  '',
            name:'',
            place_id:  '',
            latitude:0,
            longitude:0,
          };
          onSelect(selectedPlace);
        }}
        error={error}
      />
    </Autocomplete>
  );
}
