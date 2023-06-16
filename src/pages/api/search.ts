import { NextApiRequest, NextApiResponse } from "next"
import { SearchSchema } from "@/common/search.type"
import { middleware, withMethods, withValidatedBody } from "next-pipe"
import { searchProducts } from "@/server/search.util"

export default middleware<NextApiRequest, NextApiResponse>().pipe(
  withMethods(({ post }) => {
    post()
      .pipe(withValidatedBody(SearchSchema))
      .pipe(async (req, res, next, schema) => {
        res.status(200).json(await searchProducts(schema))
      })
  })
)
