import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';

import { styles } from './styles';
import { Product, ProductProps } from '../Product';

import { shoppingListExample } from '../../utils/shopping.list.data';
import firestore from '@react-native-firebase/firestore';

export function ShoppingList() {
  const [products, setProducts] = useState<ProductProps[]>([]);

  //Dessa forma os dados sao carregados apenas no momento da renderização da tela
  /* useEffect(() => {
    firestore()
    .collection('products')
    .get()
    .then( response => {
      const data = response.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }) as ProductProps[];
    setProducts(data);
    })
    .catch(err => console.log(err));

  }, []) */

  useEffect(() => {
    const subscribe = firestore()
    .collection('products')
    .where('quantity', ">", 0)
    .onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }) as ProductProps[];
    setProducts(data);
    })
    return () => subscribe();
  }, [])


  //Acessar um unico documento
/* 
  useEffect(() => {
    firestore()
    .collection('products')
    .doc('JeM7YaCZOy0OISOlaHZn')
    .get()
    .then( response => console.log({
      id: response.id,
      ...response.data()
    }))
    .catch(err => console.log(err));

  }, []) */



  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <Product data={item} />}
      showsVerticalScrollIndicator={false}
      style={styles.list}
      contentContainerStyle={styles.content}
    />
  );
}
