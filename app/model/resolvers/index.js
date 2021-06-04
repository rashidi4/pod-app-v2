import {millisToString, minutesToMillis} from '../../util';
import DOWNLOADS_QUERY from '../queries/downloads';
import PROGRESS_QUERY from '../queries/progress';

const getDateFromString = (d) => {
  let date;
  if (/\d+/.test(d)) {
    date = new Date(parseInt(d, 10));
  } else {
    date = new Date(d);
  }

  return date;
};

function dateAsText(d) {
  if (!d) return null;
  const date = getDateFromString(d);
  if (!date) return null;

  const today = new Date();
  const isToday = (today.toDateString() === date.toDateString());
  if (isToday) {
    return 'Today';
  }
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

function durationAsText(duration) {
  return millisToString(duration, true);
}

const isToday = (someDate) => {
  const today = new Date();
  return someDate.getDate() === today.getDate() &&  someDate.getMonth() === today.getMonth() && someDate.getFullYear() === today.getFullYear();//eslint-disable-line
};


function daysAgo(date) {
  if (!date) return null;
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (isToday(date)) {
    return 'Today';
  }
  const daysAgo = Math.ceil(diff / (1000*60*60*24));
  return  `${daysAgo} day${daysAgo > 1 ? 's': ''} ago`;
}

const resolvers = {
  Mutation: {
    trackPosition: (_root, variables = {}, {cache}) => {
      const {episode, podcast, inProgress = true, currentPositionMillis} = variables;
      let progress = [];
      try {
        const response = cache.readQuery({query: PROGRESS_QUERY});
        ({progress} = response);
        const index = progress.findIndex(item => item.episode.audio && item.episode.audio.uri === episode.audio.uri);
        if (index === -1) {
          progress.push({
            episode: {
              ...episode,
              inProgress,
              currentPositionMillis,
              __typename: 'EpisodeFeed'
            },
            podcast: {
              ...podcast,
              __typename: 'PodcastFeed',
            },
            __typename: 'InProgressResponse'
          });
        } else {
          if (inProgress) {
            progress[index].episode = {
              ...progress[index].episode,
              inProgress,
              currentPositionMillis: (currentPositionMillis || progress[index].episode.currentPositionMillis)
            };
          } else {
            // no longer in progress, remove it
            progress.splice(index, 1);
          }

        }
      } catch (e) {

        console.log('no downloads cache created');
      }
      const data = {
        progress
      };

      cache.writeQuery({query: PROGRESS_QUERY, data});
      return progress;
    },
    addDownload: (_root, variables = {}, { cache }) => {
      const { episode, podcast } = variables;
      let downloads = [];
      try {
        const response = cache.readQuery({query: DOWNLOADS_QUERY});
        ({downloads} = response);
        const index = downloads
          .findIndex(item => item.episode.audio && item.episode.audio.uri === episode.audio.uri);
        if (index === -1) {
          downloads.push({
            episode: {
              ...episode,
              isDownloaded: true,
              __typename: 'EpisodeFeed'
            },
            podcast: {
              ...podcast,
              __typename: 'PodcastFeed',
            },
            __typename: 'DownloadsResponse'
          });
        }
      } catch(e) {
        console.log('no downloads cache created');
      }
      const data = {
        downloads
      };

      cache.writeQuery({ query: DOWNLOADS_QUERY, data });
      return downloads;
    }
  },
  ClipDocument: {
    durationAsText: ({ duration }) => (
      durationAsText(duration)
    ),
    minuteAsText: ({ startMillis }) => {
      return millisToString(startMillis, true)
    },
    startToFinish: ({ startMillis, duration }) => {
      const finish = startMillis + duration;
      return `${durationAsText(startMillis, true)} - ${durationAsText(finish)}`;
    },
    transcriptionText: ({ transcription }) => {
      console.log(transcription);
      // return (transcription.results || []).reduce((acc, result) => {
      //   return `${acc} \n ${result.alternatives[0].transcript}`
      // }, '');
    }
  },
  EpisodeDocument:  {
    // isDownloaded: ({audio: { uri }}, _, { cache }) => {
    //   const response = cache.readQuery({query: DOWNLOADS_QUERY});
    //   const index = (response.downloads || []).findIndex(d => d.audio && d.audio.uri === uri);
    //   return index > -1;
    // },
    clientCleanSummary: ({ summary, description}) => {
      const regex = /(<([^>]+)>)/ig;
      const text = summary || description;
      const clean = (text || '').replace(regex, '');
      return clean;
    },
    currentPositionMillis: ({ currentPositionMillis, audio }, _, {cache}) => {
      if (typeof currentPositionMillis !== 'undefined') return currentPositionMillis;
      try {
        const {progress = []} = cache.readQuery({query: PROGRESS_QUERY});
        const item = progress.find(({episode}) => episode.audio.uri === audio.uri);
        if (!item) return null;
        return item.episode.currentPositionMillis;
      } catch (e) {
        console.log(e);
      }
      return null;
    },
    inProgress: ({ inProgress, audio }, _, { cache }) => {
      if (typeof inProgress !== 'undefined') return inProgress;
      try {
        const {progress = []} = cache.readQuery({query: PROGRESS_QUERY});
        const index = progress.findIndex(({episode}) => episode.audio.uri === audio.uri);
        return index > -1;
      } catch(e) {
        console.log(e);
      }
      return false;
    },
    daysAgo: (episode) => {

      const d = getDateFromString(episode.date);
      return daysAgo(d);
    },
    dateAsText: (episode) => {
      // return episode.date;
      return dateAsText(episode.date)
    },
    durationClient: ({ duration }) => {
      if (!duration) return null;

      if (duration.indexOf(':') === -1) {
        const millis = duration * 1000;
        let seconds = Math.floor((millis / 1000) % 60);
        let minutes = Math.floor((millis / (1000 * 60)) % 60);
        let hours = Math.floor((millis / (1000 * 60 * 60)) % 24);

        hours = hours < 10 ? `0${hours}`: hours;
        minutes = minutes < 10 ? `0${minutes}`: minutes;
        seconds = seconds < 10 ? `0${seconds}`: seconds;

        if (hours === '00') {
          return `${minutes}:${seconds}`;
        }
        return `${hours}:${minutes}:${seconds}`;
      }
      return duration;
    }
  }
};

export const EpisodeDocument = {
  toObject: (data) => {
    return {
      ...data,
      dateAsText: resolvers.EpisodeDocument.dateAsText(data),
    }
  }
};

export default resolvers;
