import resources from '/public/resources.json';

export async function getResources(queryObject) {
    const query = queryObject.query;
    const keywords = query.split(" ");

    let results = resources['resources'].filter(resource => {
      const idMatches = keywords.every(keyword => resource.id.toLowerCase().includes(keyword.toLowerCase()));
      const descMatches = keywords.every(keyword => resource.description.toLowerCase().includes(keyword.toLowerCase()));
      return idMatches || descMatches;
    });

    for (let filter in queryObject) {
      if (filter !== "query") {
        results = results.filter(resource => queryObject[filter].includes(resource[filter]));
      }
    }

    return results;
  }

export default async function handler(req, res) {
    // res.status(200).json(resources);
    // find the resources that contain the query in their id
    let query = req.query.q;
    let results = await getResources(query);
    res.status(200).json(results);
}
