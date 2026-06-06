import { getProducts } from "@/core/products/actions/get-products.action";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useProducts = () => {
  const productsQuery = useInfiniteQuery({
    queryKey: ["products", "infinite"],
    //! pageParam representa el índice de la página que se va a solicitar
    // 0 = primera página
    // 1 = segunda página
    // 2 = tercera página
    queryFn: ({ pageParam }) => getProducts(20, pageParam * 20),

    staleTime: 1000 * 60 * 60, // 1 hora
    //! iniciamos en la pagina index=0
    initialPageParam: 0,
    //! allPages [[p1,p2,p3],[p4,p5,p6],[p7,p8,p9]], Contiene todas las páginas descargadas hasta el momento. si se esta en la pagina inicial (0) allPages.length es igual a 1 la siguiente peticion sera getProducts(20, 1 * 20);
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });
  //console.log(productsQuery.data)
  //console.log(productsQuery.data?.pages.flat()|| [])
  return {
    //! retornamos el UseInfiniteQueryResult
    productsQuery,

    // Methods
    //! productsQuery nos puede proporcionar la siguiente pagina
    loadNextPage: productsQuery.fetchNextPage,
  };
};
