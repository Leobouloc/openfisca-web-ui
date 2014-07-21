/** @jsx React.DOM */
'use strict';

var React = require('react');

var cx = React.addons.classSet;


var Category = React.createClass({
  propTypes: {
    children: React.PropTypes.arrayOf(React.PropTypes.component).isRequired,
    hasErrors: React.PropTypes.bool,
    hasSuggestions: React.PropTypes.bool,
    index: React.PropTypes.number.isRequired,
    label: React.PropTypes.string.isRequired,
  },
  render: function() {
    return (
      <div className={cx('panel', this.props.hasErrors ? 'panel-danger' : 'panel-default')}>
        <div className="panel-heading">
          {
            this.props.hasSuggestions && (
              <span
                className='glyphicon glyphicon-info-sign pull-right'
                title='Dans cette catégorie certaines valeurs sont suggérées par le simulateur.'
              />
            )
          }
          <h4 className="panel-title">
            <a
              data-parent="#accordion"
              data-toggle="collapse"
              href={'#category-' + this.props.index}>
              {this.props.label}
            </a>
          </h4>
        </div>
        <div
          className={cx('panel-collapse', 'collapse', this.props.index === 0 ? 'in' : null)}
          id={'category-' + this.props.index}>
         <div className="panel-body">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Category;
