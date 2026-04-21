export async function getDirecciones() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/direcciondeenvio", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener direcciones");
  }

  return res.json();
}