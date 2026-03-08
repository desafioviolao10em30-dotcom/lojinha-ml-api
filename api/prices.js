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
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await response.text();

    const scripts = html.match(/<script type="application\/ld\+json".*?>.*?<\/script>/gs);

    if (!scripts) {
      return res.status(404).json({
        error: "Scripts JSON-LD não encontrados"
      });
    }

    for (const script of scripts) {

      const jsonText = script
        .replace(/<script.*?>/, "")
        .replace("</script>", "")
        .trim();

      try {

        const data = JSON.parse(jsonText);

        if (data["@type"] === "Product") {

          return res.status(200).json({
            title: data.name,
            price: data.offers.price,
            currency: data.offers.priceCurrency,
            image: data.image,
            id: data.productID
          });

        }

      } catch (err) {}

    }

    return res.status(404).json({
      error: "Produto não encontrado no JSON-LD"
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }

}
