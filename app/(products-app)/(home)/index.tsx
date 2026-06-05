import ProductList from '@/presentation/products/components/productList';
import { useProducts } from '@/presentation/products/hooks/useProducts';
import { ThemedText } from '@/presentation/theme/components/themed-text';
import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color';
import { ActivityIndicator, View } from 'react-native';
const HomeScreen = () => {
  const primary = useThemeColor({}, 'primary');
  const { productsQuery, loadNextPage } = useProducts();
  if (productsQuery.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={30} />
      </View>
    );
  }
  return (
    <View style={{ paddingHorizontal: 10 }}>
      {/* <ThemedText style={{ fontFamily: 'KanitBold', color: primary }}>
        HomeScreen
      </ThemedText>
      <ThemedText style={{ fontFamily: 'KanitRegular' }}>HomeScreen</ThemedText>
      <ThemedText style={{ fontFamily: 'KanitThin' }}>HomeScreen</ThemedText>
      <ThemedText>HomeScreen</ThemedText> */}
       <ProductList
       //! aplanamos 
        //products={productsQuery.data?.pages.flatMap((page) => page) ?? []}
        products={productsQuery.data?.pages.flat() ?? []}
        loadNextPage={loadNextPage}
      />

    </View>
  );
};
export default HomeScreen;