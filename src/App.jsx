import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function App() {
  const GETPOSTURL = `${import.meta.env.VITE_POST_GET_URL}?timestamp=${Date.now()}`
  const CREATEPOSTURL = import.meta.env.VITE_CREATE_POST_API_URL
  const USERNAME = import.meta.env.VITE_USERNAME
  const PASSWORD = import.meta.env.VITE_APPLICATION_PASSWORD


  /**
   * ALL POST STATE & ACTIONS
   */
  const [allPost, setAllPost] = useState([]);

  // ACTION 
  const getAllPost = async() => {
    const response = await axios.get(GETPOSTURL);

    setAllPost(response.data);
  }

  // invoke get all post function once on load 
  useEffect(() => {
    getAllPost()
  }, []);

  /**
   * POST CREATION INPUT STATE AND ACTION 
   */
  const [postInput, setPostInput] = useState({
    title: '',
    content: '',
    status: 'publish',
    todo_status: ''
  });
  // INPUT ON CHANGE ACTION
  const handleInputChange = (e) => {
    setPostInput((prevState) => ({
      ...prevState,
      [e.target.name] : e.target.value
    }))
  }
  // HANDLE POST FORM SUBMIT ACTION 
  const handlePostFormSubmit = async(e) => {
    e.preventDefault();

    // validation 
    if(!postInput.title || !postInput.content){
      alert('All Field Required');
    }else{
      try{
        const response = await axios.post(CREATEPOSTURL, {
          ...postInput,
          acf: {
            todo_status: postInput.todo_status
          }
        }, {
          auth: {
            username: USERNAME,
            password: PASSWORD
          }
        });
  
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }

      
    }
  }

  // HANDLE POST DELETE ACTION 
  const handlePostDelete = async(id) => {
    try{
      const response = await axios.delete(`${CREATEPOSTURL}/${id}`, {
        auth: {
          username: USERNAME,
          password: PASSWORD
        }
      });

      console.log(response.data);
    }catch(error){
      console.log(error);
    }

    


  }

  return (
    <>
      <div className="container">
        <div className="row justify-content-center my-3 create_post_row">
          <div className="col-md-6">
            <div className="post_creat_box">
              <form className="post_form" onSubmit={handlePostFormSubmit}>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Post Title"
                    name="title"
                    className="form-control"
                    value={postInput.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-2">
                  <textarea
                    name="content"
                    placeholder="Post Description"
                    className="form-control"
                    value={postInput.content}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="ACF meta field todo status"
                    name="todo_status"
                    className="form-control"
                    value={postInput.todo_status}
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Create Post</button>
              </form>
            </div>
          </div>
        </div>
        <hr />
        <div className="post_items_wrap">
          <div className="row g-3">
            {allPost.length > 0 ? allPost.map((item, index) => {
              return <div className="col-md-6" key={index}>
              <div className="card">
                <div className="card-body">
                  <h5>{item.title.rendered}</h5>
                  <div dangerouslySetInnerHTML={{__html: item.content.rendered}} />
                 
                  {item.acf.todo_status && <p>Status by ACF Plugin: {item.acf.todo_status}</p>} 

                  <button className="btn btn-danger" onClick={() => handlePostDelete(item.id)}>Delete ({item.id})</button>
                </div>
              </div>
            </div>
            }) : 'Post Not Found'}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
