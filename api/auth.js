export default async function handler(req, res) {

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      error: "Código OAuth não encontrado"
    });
  }

  const params = new URLSearchParams();

  params.append("grant_type", "authorization_code");
  params.append("client_id", process.env.ML_CLIENT_ID);
  params.append("client_secret", process.env.ML_CLIENT_SECRET);
  params.append("code", code);
  params.append("redirect_uri", "https://lojinha-ml-api.vercel.app/api/auth");

  try {

    const response = await fetch(
      "https://api.mercadolibre.com/oauth/token",
      {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/x-www-form-urlencoded"
        },
        body: params
      }
    );

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {

    return res.status(500).json({
      error: "Erro ao gerar token",
      details: error.message
    });

  }

}
