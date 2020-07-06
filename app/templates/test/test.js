import <%= lib_module %> from '../../src/<%= repo %>';

describe('<%= lib_module %>', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(<%= lib_module %>, 'greet');
      <%= lib_module %>.greet();
    });

    it('should have been run once', () => {
      expect(<%= lib_module %>.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(<%= lib_module %>.greet).to.have.always.returned('hello');
    });
  });
});
