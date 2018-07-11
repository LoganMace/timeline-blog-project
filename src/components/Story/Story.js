import React, { Component } from 'react';

import Event from './Event';

class Story extends Component {
  render() {
    return (
        <div className="outer-wrap story-wrap">
            <div className="inner-wrap">
            
                <div className="page-header story-header">
                    <h1 className="page-title story-title">Story Title <span className="byline">by John Doe</span></h1>
                    <p className="page-description story-description">Pellentesque libero mi, sodales ut purus eget, dapibus luctus leo. Nam odio dui, vulputate et lobortis eu, hendrerit ut ipsum. Integer rhoncus, urna sit amet hendrerit varius, nisl mi condimentum nisi, nec mattis ligula velit vitae sapien.</p>
                    <div className="follow-info-wrap">
                        <button className="follow-btn btn">Like</button>
                        <span className="follow-count">107</span>
                    </div>
                </div>

                <div className="events-wrap">
                    <Event />
                    <span className="connect-line"></span>
                    <Event />
                    <span className="connect-line"></span>
                    <Event />
                </div>
            
            </div>
        </div>
    );
  }
}

export default Story;