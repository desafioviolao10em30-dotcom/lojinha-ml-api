export default async function handler(req, res) {

  const { ids } = req.query;

  if (!ids) {
    return res.status(400).json({
      error: "Informe ids na query"
    });
  }

  try {

    const response = await fetch(
      `https://api.mercadolibre.com/items/${ids}`
    );

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }

}
