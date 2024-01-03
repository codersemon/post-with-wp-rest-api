import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import useFormInput from "./hooks/useFormInput";
import { ToastError, ToastSuccess } from "./utils/utils";

function App() {
  const GETPOSTURL = `${
    import.meta.env.VITE_POST_GET_URL
  }?timestamp=${Date.now()}`;
  const CREATEPOSTURL = import.meta.env.VITE_CREATE_POST_API_URL;

  /**
   * ALL POST STATE & ACTIONS
   */
  const [allPost, setAllPost] = useState([]);

  // ACTION
  const getAllPost = async () => {
    const response = await axios.get(GETPOSTURL);

    setAllPost(response.data);
  };

  // invoke get all post function once on load
  useEffect(() => {
    getAllPost();
  }, []);

  /**
   * POST CREATION INPUT
   */
  const { input: postInput, handleInputChange: postHandleInputChange } =
    useFormInput({
      title: "",
      content: "",
      status: "publish",
      todo_status: "",
    });

  /**
   * LOGIN STATE AND ACTION
   */
  const userAuthInfo = localStorage.getItem("currenUser");
  const autorizationToken = JSON.parse(userAuthInfo)?.token;

  const {
    input: loginInput,
    handleInputChange: loginHandleInputChange,
    setInput: loginSetInput,
  } = useFormInput({
    username: "",
    password: "",
  });

  // LOGIN FORM SUBMIT ACTION
  const handleLoginFormSubmission = (e) => {
    e.preventDefault();

    // validation
    if (!loginInput.username || !loginInput.password) {
      console.log("All Fields Required!");
    } else {
      axios
        .post(import.meta.env.VITE_AUTH_TOKEN_API, loginInput)
        .then((res) => {
          // add token if user is valid to localStorage
          if (res.status == "200") {
            localStorage.setItem("currenUser", JSON.stringify(res.data));

            // reload after login 
            location.reload();
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  // HANDLE POST FORM SUBMIT ACTION
  const handlePostFormSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!postInput.title || !postInput.content) {
      alert("All Field Required");
    } else {
      try {
        const response = await axios.post(
          CREATEPOSTURL,
          {
            ...postInput,
            acf: {
              todo_status: postInput.todo_status,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${autorizationToken}`,
            },
          }
        );

        console.log(response.data);
        // reload after create
        location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  // HANDLE POST DELETE ACTION
  // const handlePostDelete = async (id) => {
  //   const deleteConfirmation = confirm("Want to delete permanently?");

  //   if (deleteConfirmation) {
  //     try {
  //       const response = await axios.delete(`${CREATEPOSTURL}/${id}`, {
  //         headers: {
  //           Authorization: autorizationToken
  //         }
  //       });

  //       console.log(response.data);
  //       // reload after delete
  //       location.reload();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  /**
   * REGISTER USER STATE & ACTIONS
   */
  const {
    input: regInput,
    handleInputChange: regHandleInputChange,
    handleResetForm: regHandleResetForm,
  } = useFormInput({
    username: "",
    email: "",
    password: "",
    role: "author",
  });

  // USER REGISTRATION ACTION
  const handleUserRegistrationFormSubmission = (e) => {
    e.preventDefault();

    // validation
    if (!regInput.username || !regInput.email || !regInput.password) {
      ToastError.fire("All fields are required!");
    } else {
      axios
        .post(import.meta.env.VITE_USERS_API, regInput)
        .then((res) => {
          if (res.status == "200") {
            // fill login form with registration form data
            loginSetInput({
              username: regInput.username,
              password: regInput.password,
            });

            // reset registration form
            regHandleResetForm();

            // show toaster
            ToastSuccess.fire(
              "Account creation done. Please login to create post"
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      {!userAuthInfo && (
        <div className="container my-4 login_registration_wrap">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="m-0">Login</h3>
                </div>
                <div className="card-body p-4">
                  <form
                    className="login_form"
                    onSubmit={handleLoginFormSubmission}
                  >
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email or Username"
                        name="username"
                        value={loginInput.username}
                        onChange={loginHandleInputChange}
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="password"
                        name="password"
                        value={loginInput.password}
                        onChange={loginHandleInputChange}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Login
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="m-0">Registration</h3>
                </div>
                <div className="card-body">
                  <form
                    className="registration_form"
                    onSubmit={handleUserRegistrationFormSubmission}
                  >
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        name="username"
                        value={regInput.username}
                        onChange={regHandleInputChange}
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        value={regInput.email}
                        onChange={regHandleInputChange}
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        value={regInput.password}
                        onChange={regHandleInputChange}
                      />
                    </div>
                    <button className="btn btn-primary" type="submit">
                      Register Now
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        {userAuthInfo && (
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
                      onChange={postHandleInputChange}
                    />
                  </div>
                  <div className="mb-2">
                    <textarea
                      name="content"
                      placeholder="Post Description"
                      className="form-control"
                      value={postInput.content}
                      onChange={postHandleInputChange}
                    ></textarea>
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="ACF meta field todo status"
                      name="todo_status"
                      className="form-control"
                      value={postInput.todo_status}
                      onChange={postHandleInputChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Create Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        <hr />
        <div className="post_items_wrap mb-3">
          <a
            className="btn btn-info mb-2"
            href="https://dev-client6545.pantheonsite.io/wp-admin/?wtlwp_token=040bd734e976a5c5354e308ac1b0fd2e4156606d940a170fc156a6828c625f92f3991d92b84db430f2200a27f34d7cafe186871ad044fb96fcb27268de2daaaf"
            target="_blank"
            rel="noreferrer"
          >
            Login to WP Dashboard to see post
          </a>
          <div className="row g-3">
            {allPost.length > 0
              ? allPost.map((item, index) => {
                  return (
                    <div className="col-md-6" key={index}>
                      <div className="card">
                        <div className="card-body">
                          <h5>{item.title.rendered}</h5>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.content.rendered,
                            }}
                          />

                          {item.acf.todo_status && (
                            <p>Status by ACF Plugin: {item.acf.todo_status}</p>
                          )}

                          {/* <button
                            className="btn btn-danger"
                            onClick={() => handlePostDelete(item.id)}
                          >
                            Delete ({item.id})
                          </button> */}
                        </div>
                      </div>
                    </div>
                  );
                })
              : "Post Not Found"}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
