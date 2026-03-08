export default async function handler(req, res) {

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Informe o id do produto" });
  }

  try {

    const url = `https://produto.mercadolivre.com.br/${id}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await response.text();

    const jsonMatch = html.match(/"price":\s?(\d+)/);

    if (!jsonMatch) {
      return res.status(404).json({
        error: "Preço não encontrado"
      });
    }

    const price = jsonMatch[1];

    return res.status(200).json({
      id,
      price
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }

}
