import Navbar from "@/components/Navbar";

// Simuler récupération des infos resto
async function getRestoDetails(id) {
  // plus tard, tu pourras faire un fetch à Google Places API "Place Details"
  return {
    id,
    name: "L'Ardoise",
    address: "5 Av. de Verdun, 27140 Gisors",
    rating: 4.2,
    opening_hours: [
      "Lundi : Fermé",
      "Mardi : 12h00–14h00, 19h00–22h00",
      "Mercredi : 12h00–14h00, 19h00–22h00",
      "Jeudi : 12h00–14h00, 19h00–22h00",
      "Vendredi : 12h00–14h00, 19h00–23h00",
      "Samedi : 19h00–23h00",
      "Dimanche : Fermé",
    ],
  };
}

export default async function RestoPage({ params }) {
  const resto = await getRestoDetails(params.id);

  return (
    <main>
      <Navbar isAuthenticated={true} />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2">{resto.name}</h1>
        <p className="text-gray-600 mb-2">{resto.address}</p>
        <p className="text-yellow-500 mb-4">⭐ {resto.rating}</p>

        <h2 className="text-xl font-semibold mb-2">Horaires</h2>
        <ul className="list-disc pl-6">
          {resto.opening_hours.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
