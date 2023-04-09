import { css, Typography, useTheme } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { prisma, Product, productPrismaToObj, ProductType, productTypePrismaToObj } from "@/server/db"
import { InferGetServerSidePropsType } from "next"
import { create } from "zustand"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { defaultPaperStyles } from "@/styles/mui"

interface ProductStore {
  productTypes: ProductType[]
  setProductTypes: (productTypes: ProductType[]) => void
  products: Product[]
  setProducts: (products: Product[]) => void
}

const useProductStore = create<ProductStore>((set) => ({
  productTypes: [] as ProductType[],
  setProductTypes: (productTypes: ProductType[]) => set({ productTypes }),
  products: [] as Product[],
  setProducts: (products: Product[]) => set({ products }),
}))

function Header() {
  const theme = useTheme()

  return (
    <header css={css({ backgroundColor: theme.palette.background.light })}>
      <div className="p-[30px]">
        <div
          css={css({
            "@media (min-width: 768px)": {
              padding: "40px 100px",
            },
            "@media (min-width: 1024px)": {
              padding: "40px 200px",
            },
            "@media (min-width: 1280px)": {
              padding: "40px 0",
              margin: "auto",
              width: 1024,
            },
          })}
        >
          <section className="flex flex-col gap-2">
            <Typography variant="h1">Asteroid Shop</Typography>
            <Typography component="p" variant="subtitle1">
              Premium Twitter Accounts
            </Typography>
            <div>
              <Link
                href="https://example.com"
                className="bg-[#458EFC] px-4 py-2 rounded-sm inline-flex items-center gap-2 no-underline"
              >
                <Image src="/telegram.svg" alt="" width={16} height={16} />
                <span className="text-[0.8rem] text-white">TELEGRAM</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </header>
  )
}

function ProductCard({ product }: { product: Product }) {
  const theme = useTheme()
  const router = useRouter()
  const queryClient = useQueryClient()

  return (
    <div css={defaultPaperStyles(theme)}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <p
            css={css({
              margin: 0,
              fontSize: "0.9rem",
            })}
          >
            {product.type}
          </p>
          <p
            css={css({
              margin: "8px 0 24px 0",
              fontSize: "1.1rem",
            })}
          >
            {product.name}
          </p>
        </div>
        <button
          css={css`
            outline: none;
            width: 100%;
            border: 2px solid ${theme.palette.primary.main};
            color: ${theme.palette.primary.main};
            background-color: transparent;
            font-family: ${theme.typography.fontFamily};
            font-size: 0.9rem;
            padding: 4px 0;
            border-radius: 6px;
            transition: all 0.3s ease-in-out;
            &:hover {
              background-color: ${theme.palette.common.white};
              border-color: ${theme.palette.common.black};
              color: ${theme.palette.common.black};
              cursor: pointer;
            }
          `}
          onClick={async () => {
            const res = await fetch(`/api/products/${product.id}/purchase`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            })

            if (!res.ok) return
            queryClient.invalidateQueries(["products"])
            queryClient.invalidateQueries(["charges"])
            router.push(`/products/${product.id}`)
          }}
        >
          PURCHASE - ${product.price}
        </button>
      </div>
    </div>
  )
}

function Main() {
  const products = useProductStore((state) => state.products)

  return (
    <main
      css={css({
        flex: 1,
        padding: "20px 30px",
        "@media (min-width: 768px)": {
          padding: "20px 100px",
        },
        "@media (min-width: 1024px)": {
          padding: "20px 200px",
        },
        "@media (min-width: 1280px)": {
          padding: "20px 0",
          margin: "auto",
          width: 1024,
        },
      })}
    >
      <div
        css={css`
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        `}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}

export default function Page({ productTypes, products }: InferGetServerSidePropsType<typeof getStaticProps>) {
  const setProductTypes = useProductStore((state) => state.setProductTypes)
  const setProducts = useProductStore((state) => state.setProducts)

  setProductTypes(productTypes)
  setProducts(products)

  const { data } = useQuery(["products"], () => {
    return fetch("/api/products").then((res) => res.json())
  })

  useEffect(() => {
    if (data) {
      setProducts(data)
    }
  }, [data, setProducts])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Main />
    </div>
  )
}

export async function getStaticProps() {
  const productTypes = (await prisma.productType.findMany()).map(productTypePrismaToObj)
  const products = (
    await prisma.product.findMany({
      where: {
        charges: {
          none: {
            NOT: { status: "FAILED" },
          },
        },
      },
    })
  ).map((product) => productPrismaToObj(product))

  return {
    props: {
      productTypes,
      products,
    },
  }
}
