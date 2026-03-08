async function refreshAccessToken() {

  const params = new URLSearchParams();

  params.append("grant_type", "refresh_token");
  params.append("client_id", process.env.ML_CLIENT_ID);
  params.append("client_secret", process.env.ML_CLIENT_SECRET);
  params.append("refresh_token", process.env.ML_REFRESH_TOKEN);

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

  if (!response.ok) {
    throw new Error(data.error_description || "Erro ao renovar token");
  }

  return data.access_token;
}


export default async function handler(req, res) {

  const { ids } = req.query;

  if (!ids) {
    return res.status(400).json({
      error: "Informe ids na query"
    });
  }

  try {

    const accessToken = await refreshAccessToken();

    const response = await fetch(
      `https://api.mercadolibre.com/items/${ids}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }

}
