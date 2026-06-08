import React, { useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, useLocalSearchParams, useNavigation } from "expo-router";

import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";

import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { Formik } from "formik";
import { useProduct } from "@/presentation/products/hooks/useProduct";
import { ThemedView } from "@/presentation/theme/components/themed-view";
import ProductImages from "@/presentation/products/components/ProductImages";
import ThemeButtonGroup from "@/presentation/products/components/ThemeButtonGroup";
import { Size } from "@/core/products/interfaces/product.interface";

const ProductScreen = () => {
  //obtenemos el id del pathparam
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  // para que siempre sea un string
  const { productQuery, productMutation } = useProduct(`${id}`);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Ionicons name="camera-outline" size={25} />,
    });
  }, []);

  //este efecto se ejecutara si hay datos y se encargara de mostrar el titulo delproducto en la pagina
  useEffect(() => {
    if (productQuery.data) {
      navigation.setOptions({
        title: productQuery.data.title,
      });
    }
  }, [productQuery.data]);

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
        (values) => productMutation.mutate(values)
      }
    >
      {
        // Desestructuramos las propiedades de Formik
      ({ values, handleSubmit, handleChange, setFieldValue }) => (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView>
            {/* Carrusel de imagenes */}
            {/* value ya es un Product */}
            <ProductImages images={values.images} />

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
                options={['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']}
                selectedOptions={values.sizes}
                onSelect={(selectedSize) => {
                  const newSizesValue = values.sizes.includes(
                    selectedSize as Size
                  )
                    ? 
                    //si incluye el size seleccionado lo sacamos de la lista
                    values.sizes.filter((s) => s !== selectedSize)
                    : 
                    //si no incluye el size seleccionado lo incluimos en la lista
                    [...values.sizes, selectedSize];
                  //'sizez' es el nombre del input
                  setFieldValue('sizes', newSizesValue);
                }}
              />

              <ThemeButtonGroup
                options={['kid', 'men', 'women', 'unisex']}
                selectedOptions={[values.gender]}
                onSelect={(selectedOption) =>
                  //'gender' es el nombre del input
                  setFieldValue('gender', selectedOption)
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
              <ThemedButton icon="save-outline" onPress={() => handleSubmit()}>
                Guardar
              </ThemedButton>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};
export default ProductScreen;
