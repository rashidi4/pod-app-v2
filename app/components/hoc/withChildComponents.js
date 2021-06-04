import React from 'react';

/*
example implementation
export default withChildComponents(PodcastListItem, [{
  ComponentClass: AlbumCover,
  defaultImplementation: ({ podcast } = {}) => {
    return {
      uri: podcast.artworkUrl100
    }
  }
}, {
...
 */

function withChildComponents(WrappedComponent, childComponents = []) {

  class ComponentWithChildren extends WrappedComponent {
    constructor(props) {
      super(props);
      let {children = []} = this.props;
      if (!Array.isArray(children)) {
        children = [children];
      }
      this.components = {};
      childComponents.forEach(componentInterface => {
        const className = componentInterface.className || componentInterface.ComponentClass.name;
        this.components[className] = children
          .filter(c => c)
          .find(component => component.type === componentInterface.ComponentClass);

        if (componentInterface.defaultImplementation && !this.components[className]) {
          const componentProps = componentInterface.defaultImplementation(props);
          this.components[className] = <componentInterface.ComponentClass {...componentProps} />
        }
      });
    }
  }

  childComponents.forEach(componentInterface => {
    const className = componentInterface.className || componentInterface.ComponentClass.name;
    ComponentWithChildren[className] = componentInterface.ComponentClass;
  });
  return ComponentWithChildren;
}

export default withChildComponents;
