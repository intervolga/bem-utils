const path = require('path');
const expect = require('expect.js');
const fileExist = require('../lib/file-exist');
const dirExist = require('../lib/dir-exist');
const firstExist = require('../lib/first-exist');
const bemDirs = require('../lib/bem-dirs');
const bemPath = require('../lib/bem-path');
const dirsExist = require('../lib/dirs-exist');

describe('file-exist', () => {
  it('should resolve to file name if exist', () => {
    return fileExist(__filename).then((result) => {
      expect(result).to.contain(__filename);
    });
  });

  it('should resolve to false if directory provided', () => {
    return fileExist(__dirname).then((result) => {
      expect(result).to.be(false);
    });
  });

  it('should resolve to false if file not exist', () => {
    return fileExist(__filename + '.tmp123').then((result) => {
      expect(result).to.be(false);
    });
  });
});

describe('dir-exist', () => {
  it('should resolve to dir name if exist', () => {
    return dirExist(__dirname).then((result) => {
      expect(result).to.contain(__dirname);
    });
  });

  it('should resolve to false if file provided', () => {
    return dirExist(__filename).then((result) => {
      expect(result).to.be(false);
    });
  });

  it('should resolve to false if dir not exist', () => {
    return dirExist(__dirname + 'tmp123').then((result) => {
      expect(result).to.be(false);
    });
  });
});

describe('dirs-exist', () => {
  it('should resolve as expected', () => {
    return dirsExist([
      'test',
      'test/levels/blocks.base/page/__script/_async',
      'test/levels/blocks.base/page/__script',
      'test/levels/blocks.base/page',
      'test/levels/blocks.base0/page/__script/_async',
      'test/levels/blocks.base0/page/__script',
      'test/levels/blocks.base0/page',
    ]).then((result) => {
      expect(result).to.eql({
        'test': true,
        'test/levels/blocks.base/page/__script/_async': true,
        'test/levels/blocks.base/page/__script': true,
        'test/levels/blocks.base/page': true,
        'test/levels/blocks.base0/page/__script/_async': false,
        'test/levels/blocks.base0/page/__script': false,
        'test/levels/blocks.base0/page': false,
      });
    });
  });
});

describe('first-exist', () => {
  it('should resolve to file name if file exist', () => {
    return firstExist([__filename]).then((result) => {
      expect(result).to.contain(__filename);
    });
  });

  it('should resolve to false if file not exist', () => {
    return firstExist([]).then((result) => {
      expect(result).to.be(false);
    });
  });

  it('should resolve to first existing file name', () => {
    return firstExist([
      __dirname,
      __filename + '.tmp123',
      __filename,
      path.join(__dirname, 'cases', 'normal-bemjson', 'source.bemjson.js'),
    ]).then((result) => {
      expect(result).to.contain(__filename);
    });
  });
});

describe('bem-path', () => {
  it('should pass simple blocks', () => {
    const dep = {block: 'page'};

    const result = bemPath(dep, 'js');
    expect(result).to.be(path.join('page', 'page.js'));
  });

  it('should resolve paths like @bem/fs-scheme +nested +original', () => {
    const dep = {
      block: 'page',
      elem: 'script',
      mod: {
        name: 'async',
        val: 'yes',
      },
    };

    const result = bemPath(dep, 'js', 'blocks.common');
    expect(result).to.be(path.join('blocks.common', 'page', '__script',
        '_async', 'page__script_async_yes.js'));
  });
});

describe('bem-dirs', () => {
  it('should resolve dirs as expected', () => {
    const source = path.join(__dirname, 'cases', 'bemjson-deps',
        'source.bemdeps.json');
    const deps = require(source);
    const result = bemDirs(deps);

    expect(result).to.be.an('array');
    expect(result.length).to.be(126);
  });
});
