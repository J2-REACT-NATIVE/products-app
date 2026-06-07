import { View, Text, Image, FlatList } from 'react-native';

interface Props {
  //imagenes como un array de strings
  images: string[];
}

const ProductImages = ({ images }: Props) => {
  //!Si no hay imagenesRenderizamos una imagen de fallback
  if (images.length === 0) {
    
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}
      >
        <Image
          source={require('../../../assets/images/no-product-image.png')}
          style={{ width: 300, height: 300 }}
        />
      </View>
    );
  }

  return (
    <FlatList
    // asignamis a data el array de imagenes
      data={images}
      keyExtractor={(item) => item}
      //El flat list sera horizontal
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <Image
          source={{ uri: item }}
          style={{
            width: 300,
            height: 300,
            marginHorizontal: 7,
            borderRadius: 5,
          }}
        />
      )}
    />
  );
};
export default ProductImages;