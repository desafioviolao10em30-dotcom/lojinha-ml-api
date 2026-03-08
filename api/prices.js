export default async function handler(req, res) {

  const { ids } = req.query;

  if (!ids) {
    return res.status(400).json({
      error: "Informe ids na query"
    });
  }

  try {

    const response = await fetch(
      `https://api.mercadolibre.com/sites/MLB/search?q=${ids}`
    );

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        error: "Produto não encontrado"
      });
    }

    const item = data.results[0];

    return res.status(200).json({
      id: item.id,
      title: item.title,
      price: item.price,
      permalink: item.permalink,
      thumbnail: item.thumbnail
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }

}
