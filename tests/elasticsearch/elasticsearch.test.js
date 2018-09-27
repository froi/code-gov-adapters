const expect = require('chai').expect();
const { ElasticsearchAdapter } = require('../../libs/elasticsearch');

describe('Elasticsearch Adapter', () => {
  let adapter;
  beforeEach(() => {
    adapter = new ElasticsearchAdapter();
  });
  describe('createIndex', () => {
    describe('without settings', () => {
      it('should return index information', () => {
        // Needs to be implemented
        expect(true).to.equal(false);
      });
    });
    describe('with settings', () => {
      it('should return index information', () => {
        // Needs to be implemented
        expect(true).to.equal(false);
      });
    });
  });
  describe('deleteIndex', () => {
    it('should ', () => {
      // Needs to be implemented
      expect(true).to.equal(false);
    });
  });
  describe('indexExists', () => {
    it('should ', () => {
      // Needs to be implemented
      expect(true).to.equal(false);
    });
  });
  describe('indexDocument', () => {
    it('should ', () => {
      // Needs to be implemented
      expect(true).to.equal(false);
    });
  });
  describe('updateDocument', () => {
    it('should ', () => {
      // Needs to be implemented
      expect(true).to.equal(false);
    });
  });
  describe('deleteDocument', () => {
    it('should ', () => {
      // Needs to be implemented
      expect(true).to.equal(false);
    });
  });
  describe('getIndexForAlias', () => {
    it('should ', () => {
      // Needs to be implemented
      expect(true).to.equal(false);
    });
  });
  describe('initIndexMapping', () => {
    it('should ', () => {
      // Needs to be implemented
      expect(true).to.equal(false);
    });
  });
});
