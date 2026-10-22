// src/lib/queries/fragments.ts

export const PRODUCT_CARD_FIELDS = /* GraphQL */ `
  fragment ProductCardFields on Product {
    id
    databaseId
    slug
    name
    image {
      sourceUrl(size: MEDIUM)
      altText
    }
    metaData(keysIn: ["_kg_base_price","mg_per_vial"]) {
      key
      value
    }
    productCategories {
      nodes {
        id
        name
        slug
      }
    }
    ... on VariableProduct {
      price
      regularPrice
      salePrice
      stockStatus
      variations(first: 10) {
        nodes {
          databaseId
          price
          regularPrice
          salePrice
          stockStatus
          attributes {
            nodes {
              name
              value
            }
          }
        }
      }
    }
    ... on SimpleProduct {
      price
      regularPrice
      salePrice
      stockStatus
      stockQuantity
      backorders
      elxQtyTiers
    }
  }
`;
