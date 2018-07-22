import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import ImageCompressor from "image-compressor.js";

import {
  getStoryById,
  deleteStory,
  likeCount,
  addLike,
  unlike
} from "../../ducks/reducers/storyReducer";

import Event from "./Event";
import NewEventModal from "./NewEventModal";
import EditStoryModal from "./EditStoryModal";
import EditEventModal from "./EditEventModal";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTrash from "@fortawesome/fontawesome-pro-solid/faTrash";

class Story extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalMode: "hidden",
      editModalMode: "hidden",
      editEventModalMode: "hidden",
      eventTitle: "",
      eventDescription: "",
      images: [],
      resizedImages: [],
      uploadButtonStatus: "active",
      selectedEvent: [],
      storyTitle: '',
      storyDescription: '',
      storyCategory: ''
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleEditEventModal = this.toggleEditEventModal.bind(this);
    this.deleteStoryHandler = this.deleteStoryHandler.bind(this);
    this.saveEdit = this.saveEdit.bind(this);
  }

  eventTitleChange = value => {
    this.setState({ eventTitle: value });
  };

  eventDescriptionChange = value => {
    this.setState({ eventDescription: value });
  };

  _handleImageChange = e => {
    if (this.state.images.length === 4 ) {
      // this.setState({ uploadButtonStatus: 'disabled' })
      console.log("limit exceeded: ", this.state.images.length);
      return;
    } else {
      // this.setState({ uploadButtonStatus: 'active' })
      console.log("this.state.images.length: ", this.state.images.length);
    }
    let arr = [];
    let id = 7; //the id should come from the story or event
    let reader = new FileReader();
    let img = e.target.files[0];
    //    console.log('normal img ', img)
    //       let resized = [];
    //       resized = this.state.resizedImages.slice();
    //       resized.push(img)
    //      this.setState({resizedImages: resized})

    let that = this;
    new ImageCompressor(img, {
      quality: 0.3, //signifies how much quality you want on the photo
      success(result) {
        let newArr = that.state.resizedImages.slice();
        // console.log('image arr after resize ',result)
        newArr.push(result);
        that.setState({
          resizedImages: newArr
        });
      }
    });
    reader.addEventListener("load", () => {
      arr = this.state.images.slice();
      id++;
      arr.push({
        id: id,
        url: reader.result
      });
      // console.log("arr: ", arr.length);
      if (arr.length === 4) {
        console.log("condition met");
        this.setState({ uploadButtonStatus: "disabled" });
      }
      this.setState({
        images: arr
      });
    });
    img && reader.readAsDataURL(img);
  };

  updateEventImages=(img)=>{
   let arr =  this.state.images.slice();
    arr.push(img)
    this.setState({images: arr})
  }

  removeImages = index => {
    if (this.state.uploadButtonStatus === "disabled") {
      this.setState({ uploadButtonStatus: "active" });
    }
    let arr = this.state.images.slice();
    let arr2 = this.state.resizedImages.slice();
    arr.splice(index, 1);
    arr2.splice(index, 1);
    this.setState({ images: arr });
    this.setState({ resizedImages: arr2 });
  };

  removeImagesEvents = index =>{
    
    let arr = this.state.images.slice();
    arr.splice(index,1)
    this.setState({images: arr})
  }

  componentDidMount() {
    this.props.getStoryById(this.props.match.params.story_id)
      .then(response => {
        let {story_title, story_description, story_category} =response.value.data
        this.setState({
          storyTitle: story_title,
          storyDescription: story_description,
          storyCategory: story_category
        })
      });
    this.props.likeCount(this.props.match.params.story_id);
  }

  saveEdit(newTitle, newDescription, newCategory) {
    this.setState({
      storyTitle: newTitle,
      storyDescription: newDescription,
      storyCategory: newCategory
    })
  }

  // componentDidUpdate(prevProps) {
  //   if(this.props.story.s_updated_on !== prevProps.story.s_updated_on){
  //     this.props.getStoryById(this.props.match.params.story_id);
  //   }
  // };

  toggleModal() {
    if (this.state.modalMode === "hidden") {
      this.setState({
        modalMode: "visible",
        editModalMode: "hidden",
        editEventModalMode: "hidden"
      });
    } else {
      this.setState({
        modalMode: "hidden",
        eventTitle: "",
        eventDescription: "",
        images: [],
        resizedImages: []
      });
    }
    this.props.getStoryById(this.props.match.params.story_id);
  }

  toggleEditModal() {
    
    if (this.state.editModalMode === "hidden") {
      this.setState({
        editModalMode: "visible",
        modalMode: "hidden",
        editEventModalMode: "hidden"
      });
    } else {
      this.setState({ editModalMode: "hidden" });
    }
  }

  toggleEditEventModal(event_id) {
    const { events } = this.props.story;
    const selectedEvent = events.filter(event=>{
       return event_id==event.event_id
     })

   
     

    if (this.state.editEventModalMode === "hidden") {
      this.setState({ editEventModalMode: "visible", editModalMode: "hidden", modalMode: "hidden", eventTitle:selectedEvent[0].event_title, eventDescription:selectedEvent[0].event_description,images:selectedEvent[0].e_urls });
    } else {
      this.setState({ editEventModalMode: "hidden",eventTitle:'', eventDescription:'', images:[]});
    }
  }

  deleteStoryHandler() {
    this.props.deleteStory(+this.props.match.params.story_id)
      .then(this.props.history.push(`/profile/${this.props.user.user_id}`));
  }

  addLikeHandler() {
    // console.log("handler fired");
    this.props
      .addLike(this.props.user.user_id, this.props.match.params.story_id)
      .then(() => this.props.likeCount(this.props.match.params.story_id));
  }

  unlikeHandler() {
    this.props
      .unlike(this.props.user.user_id, this.props.match.params.story_id)
      .then(() => this.props.likeCount(this.props.match.params.story_id));
  }

  render() {
    
    // console.log('this.props: ', this.props);

    const { story } = this.props;
    const { user } = this.props;

    if (story.events) {
      var mappedEvents = story.events.reverse().map((event,index) => {
        // console.log(event);
        return (
          <Fragment key={index}>
            <Event
               key={index}
              editEventModalMode={this.state.editEventModalMode}
              story_id={this.props.match.params.story_id}
              event_id={event.event_id}
              images={event.e_urls}
              story_userid={story.user_id}
              event_title={event.event_title}
              event_description={event.event_description}
              e_created_on={event.e_created_on}
              event_id={event.event_id}
              selectedEvent={this.state.selectedEvent}
              toggleEditEventModal={this.toggleEditEventModal}
              eventTitleChange={this.eventTitleChange}
              eventDescriptionChange={this.eventDescriptionChange}
              title={this.state.eventTitle}
              eventDescription={this.state.eventDescription}
              eventImages={this.state.images}
              removeImages={this.state.removeImages}

              removeImagesEvents={this.removeImagesEvents}
              _handleImageChange={this._handleImageChange}
              removeImages={this.removeImages}
              resizedImages={this.state.resizedImages}
              uploadButtonStatus={this.state.uploadButtonStatus}
              updateEventImages={this.updateEventImages}
              />
            <span className="connect-line" />
          </Fragment>
        );
      });
    }

    return (
      <div className="outer-wrap story-wrap">
        <div className="inner-wrap">
          <div className="page-header story-header">
            <h1 className="page-title story-title">
              {this.state.storyTitle}{" "}
              <span className="byline">by {story.display_name}</span>
            </h1>
            <p className="page-description story-description">
              {this.state.storyDescription}
            </p>
            <div className="follow-info-wrap">
              {this.props.user.user_id ? (
                <button
                  onClick={() => this.addLikeHandler()}
                  className="follow-btn btn"
                >
                  Like
                </button>
              ) : (
                <div>Likes</div>
              )}
              {/* {this.props.user.user_id && } */}
              <span className="follow-count">{this.props.likes}</span>

              {/* *TO DO: only render this if story belongs to logged in user DONE*/}
              {user.user_id &&
                user.user_id === story.user_id && (
                  <div className="edit-story-links">
                    <span
                      onClick={() => this.toggleEditModal()}
                      className="edit-story-link btn border-btn"
                    >
                      Edit Story
                    </span>
                  </div>
                )}
            </div>
          </div>

          <div className="events-wrap">{mappedEvents}</div>

          {/* *TO DO: only display this if story belongs to authorized user DONE */}
          {user.user_id &&
            user.user_id === story.user_id && (
              <div className="delete-story-wrap">
                <h3 className="delete-title">Delete Story</h3>
                <button
                  className="btn negative-btn"
                  onClick={() => this.deleteStoryHandler()}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  {` Delete "${this.state.storyTitle}"`}
                </button>
              </div>
            )}

          {user.user_id &&
            user.user_id === story.user_id && (
              <div className="add-event-wrap">
                <button
                  onClick={() => this.toggleModal()}
                  className="add-event-btn btn"
                >
                  <strong>+</strong> New Event
                </button>
              </div>
            )}

          <NewEventModal
            modalMode={this.state.modalMode}
            toggleModal={this.toggleModal}
            _handleImageChange={this._handleImageChange}
            eventTitleChange={this.eventTitleChange}
            eventDescriptionChange={this.eventDescriptionChange}
            removeImages={this.removeImages}
            images={this.state.images}
            resizedImages={this.state.resizedImages}
            title={this.state.eventTitle}
            eventDescription={this.state.eventDescription}
            story_id={this.props.match.params.story_id}
            uploadButtonStatus={this.state.uploadButtonStatus}

          />

         

          <EditStoryModal
            editModalMode={this.state.editModalMode}
            toggleEditModal={this.toggleEditModal}
            eventTitleChange={this.eventTitleChange}
            eventDescriptionChange={this.eventDescriptionChange}
            saveEdit={this.saveEdit}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    story: state.story.selectedStory,
    user: state.user.authedUser,
    likes: state.story.likeCount
  };
};

export default connect(
  mapStateToProps,
  { getStoryById, deleteStory, likeCount, addLike, unlike }
)(Story);