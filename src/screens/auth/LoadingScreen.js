import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Container, Content } from 'native-base';

export function LoadingScreen() {
  return (
    <Container>
      <Content
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color="rgb(196,170,153)" />
      </Content>
    </Container>
  );
}

