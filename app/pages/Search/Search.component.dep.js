import React from 'react';
import {Text, ScrollView, StyleSheet} from 'react-native';
import {Gutter, PageWrapper, Spacer} from '../../components/styles';
import {Tabs, Recommendations} from '../../components'
import {PodcastService} from '../../services';
import variables from '../../components/styles/variables';
import PropTypes from 'prop-types';
import {createStackNavigator} from 'react-navigation-stack';
import Podcast from '../Podcast/Podcast.component';
import Playing from '../Playing/Playing.component';
import Tags from '../Tags/Tags.component';
import SearchTab from './Tabs/SearchResults.tab.component';


const SearchPage = (props) => {

  const {navigation} = props;
  const onPressItem = (e, podcastItem) => {
    navigation.navigate('Podcast', {podcastItem});
  };

  return (
    <PageWrapper>
      <Gutter flex={1}>
        <Spacer height={40}/>
        <ScrollView bounces={false}>

          <Tabs initialTab="today" style={styles.tabs}>
            <Tabs.Buttons>
              <Tabs.Anchor id="today">Search</Tabs.Anchor>
              <Tabs.Anchor id="categories">Categories</Tabs.Anchor>
              <Tabs.Anchor id="popular">Popular</Tabs.Anchor>
            </Tabs.Buttons>
            <Tabs.Content>
              <Tabs.View id="today">
                <SearchTab onPressItem={onPressItem} />
              </Tabs.View>
              <Tabs.View id="categories">
                <PodcastService.Categories>
                  {({data, loading, error}) => {
                    if (loading) return null;
                    if (error) return null;
                    if (!data || !data.categoriesSearch) return null;

                    return data.categoriesSearch.map((category) => (
                      <Recommendations key={`${category.category}`}>
                        <Recommendations.Title>{category.category}</Recommendations.Title>
                        <Recommendations.List
                          data={category.data}
                          keyExtractor={(item) => item.id}
                        >
                          {({item}) => (
                            <Recommendations.Item
                              size={100}
                              borderRadius={10}
                              image={item.image.uri}
                              title={item.author}
                              onPress={(e) => onPressItem(e, item)}
                            />)
                          }
                        </Recommendations.List>

                        <Recommendations.Separator />
                      </Recommendations>
                    ))
                  }}
                </PodcastService.Categories>

              </Tabs.View>
              <Tabs.View id="popular">
                <Text>Blah 3</Text>
              </Tabs.View>
            </Tabs.Content>
          </Tabs>

        </ScrollView>
      </Gutter>
    </PageWrapper>
  );

};


SearchPage.navigationOptions = () => ({
  headerShown: false
});

const SearchNavigator = createStackNavigator({
  Search: {
    screen: SearchPage,
  },
  Podcast: {
    screen: Podcast
  },
  Playing: {
    screen: Playing,
  },
  Tags: {
    screen: Tags
  }
}, {
  initialRouteName: 'Search',
  mode: 'modal'
});

export default SearchNavigator;

SearchPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    dispatch: PropTypes.func
  })
};





const styles = StyleSheet.create({
  tabs: {
    borderBottomWidth: 1,
    borderBottomColor: variables.BORDER_COLOR_DARK,
    marginBottom: variables.M_3
  }
});
