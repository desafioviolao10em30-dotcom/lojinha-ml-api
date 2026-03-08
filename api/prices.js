export default async function handler(req, res) {

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: "Informe a url do produto"
    });
  }

  try {

    const response = await fetch(url, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
    "Accept": "text/html",
    "Accept-Language": "pt-BR,pt;q=0.9"
  }
});

    const html = await response.text();

    // procurar bloco JSON-LD do produto
    const match = html.match(
      /<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs
    );

    if (!match) {
      return res.status(404).json({
        error: "JSON-LD não encontrado"
      });
    }

    let productData = null;

    for (const block of match) {

      const json = block
        .replace(/<script[^>]*>/, "")
        .replace("</script>", "")
        .trim();

      try {

        const parsed = JSON.parse(json);

        if (parsed["@type"] === "Product") {
          productData = parsed;
          break;
        }

      } catch (e) {}

    }

    if (!productData) {
      return res.status(404).json({
        error: "Produto não encontrado no JSON-LD"
      });
    }

    const result = {
      title: productData.name,
      price: productData.offers?.price,
      currency: productData.offers?.priceCurrency,
      image: productData.image,
      productID: productData.productID,
      sku: productData.sku,
      url: productData.offers?.url
    };

    return res.status(200).json(result);

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }

}
