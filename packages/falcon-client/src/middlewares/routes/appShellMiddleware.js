import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { APP_INIT } from '../../graphql/config.gql';
import HtmlHead from '../../components/HtmlHead';

/**
 * App shell rendering middleware.
 * @return {function(ctx: object, next: function): Promise<void>} Koa middleware
 */
export default ({ loadableStats }) => async (ctx, next) => {
  const { client } = ctx.state;
  const { config } = client.readQuery({ query: APP_INIT });
  const chunkExtractor = new ChunkExtractor({
    stats: loadableStats,
    entrypoints: ['client']
  });

  const markup = (
    <ChunkExtractorManager extractor={chunkExtractor}>
      <HtmlHead htmlLang={config.i18n.lng} />
    </ChunkExtractorManager>
  );

  renderToString(markup);

  ctx.state.chunkExtractor = chunkExtractor;
  ctx.state.helmetContext = Helmet.renderStatic();

  return next();
};
