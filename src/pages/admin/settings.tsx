import { ProductType, PurchasedProduct } from "@/server/db"
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  styled,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { GetServerSidePropsContext } from "next"
import { getServerSession } from "next-auth/next"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { defaultDialogStyles, defaultDialogContentStyles, defaultPaperStyles, defaultTextAreaStyles } from "@/styles/mui"
import { useTheme } from "@mui/material"

const StyledAddButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}))

function AddButton(props: ButtonProps) {
  return <StyledAddButton variant="contained" {...props} />
}

function AddNewProductTypeDialog({
  open,
  onClose,
  productType,
}: {
  open: boolean
  onClose: () => void
  productType?: ProductType
}) {
  const theme = useTheme()
  const productTypeName = productType?.name ?? ""
  const [name, setName] = useState(productTypeName)
  useEffect(() => setName(productTypeName), [productTypeName])

  const reset = useCallback(() => setName(""), [setName])

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    async mutationFn() {
      if (productType) {
        const res = await fetch(`/api/product-types/${productType.name}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        })
        if (!res.ok) throw new Error("Failed to update product type")
      } else {
        const res = await fetch("/api/product-types", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        })
        if (!res.ok) throw new Error("Failed to create product type")
      }
    },

    onSuccess() {
      queryClient.invalidateQueries(["product-types"], { exact: true })
      reset()
      onClose()
    },
  })

  return (
    <Dialog
      css={defaultDialogStyles(theme)}
      open={open}
      onClose={() => {
        reset()
        onClose()
      }}
    >
      <DialogTitle>
        {productType ? "Edit product type" : "Add new type"}
      </DialogTitle>
      <DialogContent css={defaultDialogContentStyles(theme)}>
        <TextField label="name" size="small" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={() => mutate()}>OK</Button>
      </DialogContent>
    </Dialog>
  )
}

function AddNewProductDialog({
  open,
  onClose,
  product,
  productTypes,
}: {
  open: boolean
  onClose: () => void
  product?: PurchasedProduct
  productTypes: ProductType[]
}) {
  const productName = product?.name ?? ""
  const productType = (product?.type && productTypes.find((t) => t.name == product?.type)?.name) ?? ""
  const productPrice = product?.price.toString() ?? ""
  const productContent = product?.content ?? ""

  const [name, setName] = useState(productName)
  const [type, setType] = useState(productType)
  const [price, setPrice] = useState(productPrice)
  const [content, setContent] = useState(productContent)

  const theme = useTheme()

  useEffect(() => {
    setName(productName)
    setType(productType)
    setPrice(productPrice)
  }, [productName, productType, productPrice])

  const reset = useCallback(() => {
    setName("")
    setType("")
    setPrice("")
    setContent("")
  }, [setName, setType, setPrice, setContent])

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    async mutationFn() {
      if (product) {
        const res = await fetch(`/api/products/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, type: type || null, price: parseInt(price), content }),
        })
        if (!res.ok) throw new Error("Failed to update product")
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, type: type || null, price: parseInt(price), content }),
        })
        if (!res.ok) throw new Error("Failed to create product")
      }
    },

    onSuccess() {
      queryClient.invalidateQueries(["products"], { exact: true })
      reset()
      onClose()
    },
  })

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset()
        onClose()
      }}
    >
      <DialogTitle>Add new product</DialogTitle>
      <DialogContent css={defaultDialogContentStyles(theme)}>
        <Select
          sx={{
            "& .MuiSelect-select": {
              padding: "8.5px 14px",
            },
          }}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {productTypes.map((productType: ProductType) => (
            <MenuItem key={productType.name} value={productType.name}>
              {productType.name}
            </MenuItem>
          ))}
        </Select>
        <TextField label="name" size="small" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="flex items-center gap-3">
          <TextField
            label="price"
            size="small"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <p className="my-0">USD</p>
        </div>
        <TextareaAutosize
          css={defaultTextAreaStyles(theme)}
          placeholder="Product content here"
          aria-label="product content"
          minRows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button onClick={() => mutate()}>OK</Button>
      </DialogContent>
    </Dialog>
  )
}

function TableColumn({
  children,
  onEdit,
  onDelete,
}: {
  children: ReactNode
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex justify-between items-center">
      <p className="my-0">{children}</p>
      <div className="flex">
        <Button onClick={onEdit}>EDIT</Button>
        <Button onClick={onDelete}>Delete</Button>
      </div>
    </div>
  )
}

export default function Page() {
  const theme = useTheme()
  const [selectedProductType, setSelectedProductType] = useState<ProductType>()
  const [selectedProduct, setSelectedProduct] = useState<PurchasedProduct>()
  const [openAddNewProductType, setOpenAddNewProductType] = useState(false)
  const [openAddNewProduct, setOpenAddNewProduct] = useState(false)

  const queryClient = useQueryClient()

  const productTypes = useQuery(["product-types"], async () => {
    const res = await fetch("/api/product-types")
    if (!res.ok) throw new Error("Failed to fetch product types")
    return res.json()
  })

  const products = useQuery(["products"], async () => {
    const res = await fetch("/api/products?details=true")
    if (!res.ok) throw new Error("Failed to fetch products")
    return res.json()
  })

  const productTypeDeleteMutation = useMutation({
    async mutationFn(id: string) {
      const res = await fetch(`/api/product-types/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete product type")
    },
    onSuccess() {
      queryClient.invalidateQueries(["product-types"], { exact: true })
    },
  })

  const productDeleteMutation = useMutation({
    async mutationFn(id: string) {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete product")
    },
    onSuccess() {
      queryClient.invalidateQueries(["products"], { exact: true })
    },
  })

  return (
    <>
      <AddNewProductTypeDialog
        open={openAddNewProductType}
        productType={selectedProductType}
        onClose={() => {
          setSelectedProductType(undefined)
          setOpenAddNewProductType(false)
        }}
      />
      {productTypes.data && (
        <AddNewProductDialog
          open={openAddNewProduct}
          product={selectedProduct}
          onClose={() => {
            setSelectedProduct(undefined)
            setOpenAddNewProduct(false)
          }}
          productTypes={productTypes.data}
        />
      )}
      <Box
        component="main"
        sx={{
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
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
        }}
      >
        <Typography variant="h1">Settings</Typography>
        <section className="flex flex-col gap-3">
          <div className="flex justify-between">
            <Typography variant="h2">Product types</Typography>
            <AddButton onClick={() => setOpenAddNewProductType(true)}>Add new...</AddButton>
          </div>
          <div css={defaultPaperStyles(theme)}>
            {productTypes.data ? (
              productTypes.data.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {productTypes.data.map((productType: ProductType) => (
                    <TableColumn
                      key={productType.name}
                      onEdit={() => {
                        setSelectedProductType(productType)
                        setOpenAddNewProductType(true)
                      }}
                      onDelete={() => {
                        productTypeDeleteMutation.mutate(productType.name)
                      }}
                    >
                      {productType.name}
                    </TableColumn>
                  ))}
                </div>
              ) : (
                <p className="my-1">Empty :(</p>
              )
            ) : (
              <p className="my-1">Loading...</p>
            )}
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <div className="flex justify-between">
            <Typography variant="h2">Products</Typography>
            <AddButton onClick={() => setOpenAddNewProduct(true)}>Add new...</AddButton>
          </div>
          <div css={defaultPaperStyles(theme)}>
            {products.data ? (
              products.data.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {products.data.map((product: PurchasedProduct) => (
                    <TableColumn
                      key={product.name}
                      onEdit={() => {
                        setSelectedProduct(product)
                        setOpenAddNewProduct(true)
                      }}
                      onDelete={() => {
                        productDeleteMutation.mutate(product.id)
                      }}
                    >
                      {product.price} USD - {product.name}
                    </TableColumn>
                  ))}
                </div>
              ) : (
                <p className="my-1">Empty :(</p>
              )
            ) : (
              <p className="my-1">Loading...</p>
            )}{" "}
          </div>
        </section>
      </Box>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session || !session.user.roles.includes("ADMIN")) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
