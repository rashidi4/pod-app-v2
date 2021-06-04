import gql from 'graphql-tag';


export const typeDefs = gql`
    directive @client on FIELD
    
    input AudioInput {
        uri: String
        durationMillis: Int
        redirectUri: String
    }
    
    input ImageInput {
        uri: String
    }
    
    input EpisodeInput {
        id: ID!
        audio: AudioInput!
        date: String
        description: String
        duration: String
        feedUri: String
        image: ImageInput
        subtitle: String
        summary: String
        title: String
    }

    input PodcastInput {
        id: ID!
        author: String
        description: String
        feedUri: String
        image: ImageInput
        title: String!
        summary: String
        genres: [String]
    }
    
    extend type EpisodeDocument {
        daysAgo: String
        dateAsText: String
        durationClient: String
        isDownloaded: Boolean
        currentPositionMillis: Int
        inProgress: Boolean
        clientCleanSummary: String
    }
    
    extend type ClipDocument {
        durationAsText: String
        minuteAsText: String
        startMillis: Int
        startToFinish: String
        transcriptionText: String
    }
    
    extend type Query {
        downloads: [DownloadsResponse]
        progress: [InProgressResponse]
    }
    
    extend type Mutation {
        addDownload(episode: EpisodeInput!, podcast: PodcastInput):[DownloadsResponse]
        trackPosition(
            episode: EpisodeInput!
            podcast: PodcastInput
            inProgress: Boolean
            currentPositionMillis: Int
        ): [InProgressResponse]
    }

    type DownloadsResponse {
        episode: EpisodeFeed
        podcast: PodcastFeed
    }
    
    type InProgressResponse {
        episode: EpisodeFeed
        podcast: PodcastFeed
    }
    
`;
