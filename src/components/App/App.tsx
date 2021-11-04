import React, { useState, useEffect } from 'react';
import Feed from '../Feed/Feed';
import Form from '../Form/Form';
import {BrowserRouter as Router, Route, Switch, useHistory} from 'react-router-dom';
import './App.css';
import { CleanArticle, fetchNewsData, getSentiment } from '../../apiCalls'


const App = (): JSX.Element => {

  const [ articles, setArticles ] = useState<CleanArticle[]>([])
  const [ userSentiment, setUserSentiment ] = useState<number | null>(null)
  const [ error, setError ] = useState('')

  useEffect((): void => {
    fetchNewsData()
      .then((cleanArticles: CleanArticle[]): void => {
        getSentimentScores(cleanArticles)
          .then((response: number[]) => {

            const scoredArticles = cleanArticles.map((article, i) => {
               article.sentiment = response[i] || 0;
               return article;
            })

            setArticles(scoredArticles)
          })
      })
      .catch(error => setError(error.message))
  }, [])

  const getSentimentScores = (cleanArticles: CleanArticle[]): Promise<number[]> => {
    return Promise.all(
      cleanArticles.map((article: CleanArticle) => {
        return getSentiment(article.abstract)
      })
    )
  }

  const changeUserSentiment = (newSentiment: number) => {
    setUserSentiment(newSentiment)
    sortBySentiment(newSentiment)
  }

  const sortBySentiment = (newSentiment: number): void => {
    let sortedArticles = articles.slice();

    if (newSentiment === -1) {
      sortedArticles = sortedArticles.sort((articleA, articleB) => {
        return articleB.sentiment - articleA.sentiment;
      })
    } else if (newSentiment === 1) {
      sortedArticles = sortedArticles.sort((articleA, articleB) => {
        return articleA.sentiment - articleB.sentiment;
      })
    }

    setArticles(sortedArticles)
  }

  // const returnToForm: any = () => {
  //   const history = useHistory();
  //   history.goBack();
  // }

  return (
    <div className="App">
      <div className="app-container">
        <header className="App-header">
          <h1 className="header-text">Well<span className="header-text-2">News</span></h1>
        </header>
        <Router>
          <Switch>
            <Route exact path="/">
              <Form changeUserSentiment={changeUserSentiment}/>
            </Route>
            <Route path="/feed/">
              <Feed articles={articles} />
            </Route>
          </Switch>
        </Router>
        {error && <h2>{error}</h2>}
      </div>
    </div>
  )
}

export default App;
