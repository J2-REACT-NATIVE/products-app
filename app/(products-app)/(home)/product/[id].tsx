import React, { useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  Href,
  Redirect,
  router,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";

import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";

import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { Formik } from "formik";
import { useProduct } from "@/presentation/products/hooks/useProduct";
import { ThemedView } from "@/presentation/theme/components/themed-view";
import ProductImages from "@/presentation/products/components/ProductImages";
import ThemeButtonGroup from "@/presentation/products/components/ThemeButtonGroup";
import { Size } from "@/core/products/interfaces/product.interface";
import MenuIconButton from "@/presentation/theme/components/MenuIconButton";
import { useCameraStore } from "@/presentation/store/useCameraStore";
import ProcessingModal from "@/presentation/theme/components/ProcessingModal";

const ProductScreen = () => {
  const { selectedImages, clearImages } = useCameraStore();
  //obtenemos el id del pathparam
  const { id } = useLocalSearchParams();

  const navigation = useNavigation();
  // para que siempre sea un string
  //! si id es igual a new productQuery.data tendra el onjeto emptyProduct con valores vacios que serviran para estableces los valores en el formulario para que el usuario puedea crear un producto nuevo.
  const { productQuery, productMutation } = useProduct(`${id}`);
  //!Limpiamos las imagenes que estan en el store cuando se desmonta el componente para que no vayan a otro producto.
  useEffect(() => {
    return () => {
      clearImages();
    };
  }, [clearImages]);

  useEffect(() => {
    navigation.setOptions({
      //headerRight: () => <Ionicons name="camera-outline" size={25} />,
      headerRight: () => (
        <MenuIconButton
          onPress={() => router.push(`/camera` as Href)}
          icon={"camera-outline"}
        />
      ),
    });
  }, [navigation]);

  //este efecto se ejecutara si hay datos y se encargara de mostrar el titulo del producto en la pagina
  useEffect(() => {
    if (productQuery.data) {
      navigation.setOptions({
        title: productQuery.data.title,
      });
    }
  }, [navigation, productQuery.data]);

  // Si se esta cargando el producto
  if (productQuery.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={30} />
      </View>
    );
  }
  //si el producto no se encontro
  if (!productQuery.data) {
    return <Redirect href="/(products-app)/(home)" />;
  }

  const product = productQuery.data!;

  return (
    <Formik
      //initialvalues es obligatorio
      initialValues={product}
      onSubmit={
        //!value ya es un Product
        //(productLike)=>console.log(productLike)
        //!Llamamos al metodo que hace la mutacion
        //! selectedImages son todas las imagenes que vienen de la pantalla anterior
        (values) =>
          productMutation.mutate({
            ...values,
            images: [...values.images, ...selectedImages],
          })
      }
    >
      {
        // Desestructuramos las propiedades de Formik
        ({ values, handleSubmit, handleChange, setFieldValue }) => (
          <>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <ScrollView
                //! Implementar el pull to request
                refreshControl={
                  <RefreshControl
                    refreshing={productQuery.isFetching}
                    onRefresh={async () => await productQuery.refetch()}
                  />
                }
              >
                {/* Carrusel de imagenes */}
                {/* value ya es un Product */}
                {/* <ProductImages images={values.images} /> */}
                <ProductImages images={[...product.images, ...selectedImages]} />

                <ThemedView style={{ marginHorizontal: 10, marginTop: 20 }}>
                  <ThemedTextInput
                    placeholder="Título"
                    style={{ marginVertical: 5 }}
                    value={values.title}
                    onChangeText={handleChange("title")}
                  />

                  <ThemedTextInput
                    placeholder="Slug"
                    style={{ marginVertical: 5 }}
                    value={values.slug}
                    onChangeText={handleChange("slug")}
                  />

                  <ThemedTextInput
                    placeholder="Descripción"
                    multiline
                    numberOfLines={5}
                    style={{ marginVertical: 5 }}
                    value={values.description}
                    onChangeText={handleChange("description")}
                  />
                </ThemedView>

                <ThemedView
                  style={{
                    marginHorizontal: 10,
                    marginVertical: 5,
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <ThemedTextInput
                    placeholder="Precio"
                    style={{ flex: 1 }}
                    value={values.price.toString()}
                    onChangeText={handleChange("price")}
                  />
                  <ThemedTextInput
                    placeholder="Inventario"
                    style={{ flex: 1 }}
                    value={values.stock.toString()}
                    onChangeText={handleChange("stock")}
                  />
                </ThemedView>

                <ThemedView
                  style={{
                    marginHorizontal: 10,
                  }}
                >
                  <ThemeButtonGroup
                    options={["XS", "S", "M", "L", "XL", "XXL", "XXXL"]}
                    selectedOptions={values.sizes}
                    onSelect={(selectedSize) => {
                      const newSizesValue = values.sizes.includes(
                        selectedSize as Size,
                      )
                        ? //si incluye el size seleccionado lo sacamos de la lista
                          values.sizes.filter((s) => s !== selectedSize)
                        : //si no incluye el size seleccionado lo incluimos en la lista
                          [...values.sizes, selectedSize];
                      //'sizez' es el nombre del input
                      setFieldValue("sizes", newSizesValue);
                    }}
                  />

                  <ThemeButtonGroup
                    options={["kid", "men", "women", "unisex"]}
                    selectedOptions={[values.gender]}
                    onSelect={(selectedOption) =>
                      //'gender' es el nombre del input
                      setFieldValue("gender", selectedOption)
                    }
                  />
                </ThemedView>

                {/* Botón para guardar */}

                <View
                  style={{
                    marginHorizontal: 10,
                    marginBottom: 50,
                    marginTop: 20,
                  }}
                >
                  <ThemedButton
                    icon="save-outline"
                    onPress={() => handleSubmit()}
                    disabled={productMutation.isPending}
                  >
                    {productMutation.isPending ? "Guardando" : "Guardar"}
                  </ThemedButton>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>

            <ProcessingModal
              visible={productMutation.isPending}
              title="Actualizando producto"
              message="Estamos guardando los datos y subiendo las imágenes. Por favor espera un momento."
            />
          </>
        )
      }
    </Formik>
  );
};
export default ProductScreen;
