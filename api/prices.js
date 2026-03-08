export default async function handler(req, res) {

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: "Informe a url do produto"
    });
  }

  try {

    // extrair ID MLB da URL
    const match = url.match(/MLB\d+/);

    if (!match) {
      return res.status(400).json({
        error: "ID do produto não encontrado na URL"
      });
    }

    const itemId = match[0];

    const cleanUrl = `https://produto.mercadolivre.com.br/${itemId}`;

    const response = await fetch(cleanUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await response.text();

    const priceMatch = html.match(/"price":\s?(\d+(\.\d+)?)/);

    if (!priceMatch) {
      return res.status(404).json({
        error: "Preço não encontrado"
      });
    }

    const price = priceMatch[1];

    return res.status(200).json({
      id: itemId,
      price
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }

}
