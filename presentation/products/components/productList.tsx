import { useState } from "react";
import { FlatList, RefreshControl } from "react-native";

import { useQueryClient } from "@tanstack/react-query";
import { Product } from "../../../core/products/interfaces/product.interface";
import { ProductCard } from "./ProductCard";
import { delay } from "@/helpers/utils";

interface Props {
  products: Product[];
  loadNextPage: () => void;
}

const ProductList = ({ products, loadNextPage }: Props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onPullToRefresh = async () => {
    setIsRefreshing(true);
    //await new Promise((resolve) => setTimeout(resolve, 200));
    await delay()
    //Invalidamos el cache con el key ["products", "infinite"] para que traiga la data nueva
    queryClient.invalidateQueries({
      queryKey: ["products", "infinite"],
    });

    setIsRefreshing(false);
  };

  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductCard product={item} />}
      onEndReached={loadNextPage}
      //cuando se este cerca del 80% se disoara el loadNextPage
      onEndReachedThreshold={0.8} 
      showsVerticalScrollIndicator={false}
      //PullToRefresh: Para traer los nuevo datos haciendo el scroll hacia abajo para que se refresque la lista
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onPullToRefresh} />
      }
    />
  );
};
export default ProductList;
