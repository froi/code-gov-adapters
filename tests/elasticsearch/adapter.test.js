const expect = require('chai').expect;
const { ElasticsearchAdapter } = require('../../libs/elasticsearch');
const nock = require('nock');
const {
  create_repos_index_response,
  delete_index_response,
  index_document_response,
  alias_exists_reponse,
  alias_exists_404_reponse,
  update_document_response,
  delete_document_response,
  indexes_for_alias_response,
  put_mapping_response
} = require('./nock.responses');

// TODO: Use nock.js to mock Elasticsearch requests and responses
describe('Elasticsearch Adapter', () => {
  let adapter;
  const mockJsonContentType = { "Content-Type": "application/json" };
  const mockSettings =  {
    "settings" : {
      "number_of_shards" : 3,
      "number_of_replicas" : 2
    }
  };
  const mockDocument = {
    title: 'Test 1',
    tags: ['y', 'z'],
    published: true,
    published_at: '2013-01-01',
    counter: 1
  };
  const mockMappings =  {
    repos: {
      properties: {
        name: {
          type: 'string'
        }
      }
    }
  };

  beforeEach(() => {
    adapter = new ElasticsearchAdapter({
      hosts: ['http://localhost:9200'],
      mappings: null,
      settings: null,
      requestTimeout: 30000
    });

    nock('http://localhost:9200')
      .persist()
      .put('/repos')
      .reply(200, create_repos_index_response)
      .put('/repos', mockSettings, mockJsonContentType)
      .reply(200, create_repos_index_response)
      .delete('/repos')
      .reply(200, delete_index_response)
      .head('/repos')
      .reply(200, true)
      .head('/silly')
      .reply(404, false)
      .post('/repos/repo/1', mockDocument)
      .reply(200, index_document_response)
      .head('/_alias/repos')
      .reply(200, alias_exists_reponse)
      .head('/_alias/silly')
      .reply(404, alias_exists_404_reponse)
      .post('/repos/repo/1/_update', { doc: mockDocument }, mockJsonContentType)
      .reply(200, update_document_response)
      .delete('/repos/repo/1')
      .reply(200, delete_document_response)
      .get('/_alias/repos')
      .reply(200, indexes_for_alias_response)
      .put('/repos/_mapping/repo', mockMappings, mockJsonContentType)
      .reply(200, put_mapping_response);
  });
  describe('createIndex', () => {
    describe('without settings', () => {
      it('should return index information', async () => {
        const response = await adapter.createIndex({
          index: 'repos'
        });
        expect(response).to.deep.equal(create_repos_index_response);
      });
    });
    describe('with settings', () => {
      it('should return index information', async () => {
        const response = await adapter.createIndex({
          index: 'repos',
          body: mockSettings
        });
        expect(response).to.deep.equal(create_repos_index_response);
      });
    });
  });
  describe('deleteIndex', () => {
    it('should ', async () => {
      const response = await adapter.deleteIndex({ index: 'repos' });
      expect(response).to.deep.equal(delete_index_response);
    });
  });
  describe('indexExists', () => {
    it('should return true for index `repos`', async () => {
      const response = await adapter.indexExists('repos');
      expect(response).to.equal(true);
    });
    it('should return false for index `silly`', async () => {
      const response = await adapter.indexExists('silly');
      expect(response).to.equal(false);
    });
  });
  describe('indexDocument', () => {
    it('should return document creation acknowledgement ', async () => {
      const response = await adapter.indexDocument({
        index: 'repos',
        type: 'repo',
        id: '1',
        document: mockDocument
      });
      expect(response).to.deep.equal(index_document_response);
    });
  });
  describe('updateDocument', () => {
    it('should return a successful updated message', async () => {
      const response = await adapter.updateDocument({
        index: 'repos',
        type: 'repo',
        id: 1,
        document: mockDocument
      });
      expect(response).to.deep.equal(update_document_response);
    });
  });
  describe('deleteDocument', () => {
    it('should return a successfull delete message', async () => {
      const response = await adapter.deleteDocument({
        index: 'repos',
        type: 'repo',
        id: 1
      });
      expect(response).to.deep.equal(delete_document_response);
    });
  });
  describe('getIndexesForAlias', () => {
    it('should ', async () => {
      const response = await adapter.getIndexesForAlias({ alias: 'repos' });
      expect(response).to.deep.equal(['repos1', 'repos2', 'repos3', 'repos4']);
    });
  });
  describe('aliasExists', () => {
    it('should return true for alias repos', async () => {
      const response = await adapter.aliasExists({
        name: 'repos'
      });
      expect(response).to.deep.equal(true);
    });
    it('should return false for alias silly', async () => {
      const response = await adapter.aliasExists({
        name: 'silly'
      });
      expect(response).to.deep.equal(false);
    });
  });
  describe('initIndexMapping', () => {
    it('should ', async () => {
      const response = await adapter.initIndexMapping({
        index: 'repos',
        type: 'repo',
        body: mockMappings
      });
      expect(response).to.deep.equal(put_mapping_response);
    });
  });
});
