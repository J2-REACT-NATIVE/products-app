import { getProductById } from "@/core/products/actions/get-product-by-id.action";
import { Product } from "../../../core/products/interfaces/product.interface";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Alert } from "react-native";
import { updateCreateProduct } from "@/core/products/actions/create-update-product.action";

export const useProduct = (productId: string) => {
  const queryClient = useQueryClient();
  const productIdRef = useRef(productId); //! el valor ouede ser new o UUID

  const productQuery = useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductById(productId),
    staleTime: 1000 * 60 * 60, // 1 hora
  });

  // Mutación
  const productMutation = useMutation({
    mutationFn: async (data: Product) => {
      console.log(data);
      return await updateCreateProduct({
        ...data,
        //! Para poder asignar el valor del id en el objeto que se enviara como argumento a updateCreateProduct()
        id: productIdRef.current,
      });
    },

    onSuccess(data: Product) {
      //en data vienen los valores que se retornaron en la propiedad mutationFn.
      //! con esto controlamos que el ususario al no salir de la pantalla de agregar nuevo producto, en caso de dar click en grabar la variable productIdRef ya va a tener el uuid devuelto por la base de datos al momento de grabar por lo tanto al momento de ejecutarse el mutationFunction se ira por la accion updateProduct()
      productIdRef.current = data.id;

      //!Invalidamos queries cuando la mutacion fue exitosa
      queryClient.invalidateQueries({
        queryKey: ["products", "infinite"],
      });
      queryClient.invalidateQueries({
        queryKey: ["products", data.id],
      });

      Alert.alert("Producto guardado", `${data.title} se guardo correctamente`);
    },
  });

  // Mantener el ID del producto en caso de ser uno nuevo

  return {
    productQuery,
    productMutation,
  };
};
