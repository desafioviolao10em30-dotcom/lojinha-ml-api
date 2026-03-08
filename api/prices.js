export default async function handler(req, res) {
  const { ids } = req.query;

  if (!ids) {
    return res.status(400).json({
      error: "Nenhum ID de produto informado"
    });
  }

  return res.status(200).json({
    message: "Endpoint de preços funcionando",
    ids_recebidos: ids
  });
}
