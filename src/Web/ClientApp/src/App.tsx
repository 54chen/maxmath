import './App.css'
import type { LoaderFunctionArgs } from "react-router-dom";
import {
  Form,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  redirect,
  useActionData,
  useFetcher,
  useLocation,
  useNavigation,
  useRouteLoaderData,
} from "react-router-dom";
import { fakeAuthProvider } from "./auth.ts";
import Grass from './models/assets/grass.jpg'
import Guide from './models/assets/guide.jpg'
import Level1 from './Level1.tsx';

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader() {
      // Our root route always provides the user, if logged in
      return { user: fakeAuthProvider.username };
    },
    Component: Layout,
    children: [
      {
        index: true,
        // path: "login",
        action: loginAction,
        Component: LoginPage,
      },
    ],
  },
  {
    path: "/logout",
    async action() {
      // We signout in a "resource route" that we can hit from a fetcher.Form
      await fakeAuthProvider.signout();
      return redirect("/");
    },
  },
  {
    path: "Level1",
    loader: protectedLoader,
    Component: Level1,
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
  );
}

function Layout() {
  return (
    <div>
      <div style={{ backgroundImage: `url(${Grass})` }} className={'fixed bg-cover w-full h-screen p-0 top-0 left-0'}> 
      <h1 className="text-white text-3xl font-bold m-8">MAX's MineMaths V0.1 2024</h1>
      <div className="bg-green-500 p-4 rounded-lg flex flex-col md:flex-row items-center">
        <div className="w-1/2 ml-4">
          <img src={Guide} alt="Game Demo" className="w-80 m-12 rounded-lg" />
        </div>
        <div className="md:w-1/2 text-left text-xl">
          <p className="text-white mb-4">How to play:</p>
          <ul className="text-white list-disc list-inside mb-4">
            <li>First, you click the screen so now you can see around.</li>
            <li>Then you use W, A, S, and D or the arrow keys and the blank key to jump and move around.</li>
            <li>Use p to switch to the pickaxe and h to switch to the hammer.</li>
          </ul>
            <Outlet />
            <AuthStatus />
          
        </div>
      </div>


      </div>
    </div>
  );
}

function AuthStatus() {
  // Get our logged in user, if they exist, from the root route loader data
  const { user } = useRouteLoaderData("root") as { user: string | null };
  const fetcher = useFetcher();

  if (!user) {
    return <p></p>;
  }

  const isLoggingOut = fetcher.formData != null;

  return (
    <div>
      <p>Welcome {user}!</p>
      <fetcher.Form method="post" action="/logout">
        <button type="submit" disabled={isLoggingOut}>
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </fetcher.Form>
    </div>
  );
}

async function loginAction({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string | null;

  // Validate our form inputs and return validation errors via useActionData()
  if (!username) {
    return {
      error: "You must provide a username to log in",
    };
  }

  // Sign in and redirect to the proper destination if successful.
  try {
    await fakeAuthProvider.signin(username);
  } catch (error) {
    // Unused as of now but this is how you would handle invalid
    // username/password combinations - just like validating the inputs
    // above
    return {
      error: "Invalid login attempt",
    };
  }

  const redirectTo = formData.get("redirectTo") as string | null;
  return redirect(redirectTo !='/' ? redirectTo! : "/Level1");
}

function LoginPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const from = params.get("from") || "/";

  const navigation = useNavigation();
  const isLoggingIn = navigation.formData?.get("username") != null;

  const actionData = useActionData() as { error: string } | undefined;

  const { user } = useRouteLoaderData("root") as { user: string | null };

  if (user) {
    return ''
  }

  return (
    <div className='p-4'>
      <p>Please choose your class and input your name!</p>
      <Form method="post" replace>
        <input type="hidden" name="redirectTo" value={from} />
        <label><GradeSelect/></label>

        <label className='p-4'>
          Username: <input name="username" className='p-auto text-black w-60 rounded-md'/>
        </label>{" "}
        <button type="submit" className='w-full flex items-center justify-center m-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
        {actionData && actionData.error ? (
          <p style={{ color: "red" }}>{actionData.error}</p>
        ) : null}
      </Form>
    </div>
  );
}

function protectedLoader({ request }: LoaderFunctionArgs) {
  if (!fakeAuthProvider.isAuthenticated) {
    const params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/?" + params.toString());
  }
  return null;
}

const GradeSelect = () => {
  return (
    <div className="flex p-4">Class:
    <select className="block w-60 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
      <option value="year1">Year 1</option>
      <option value="year2">Year 2</option>
      <option value="year3">Year 3</option>
      <option value="year4">Year 4</option>
      <option value="year5">Year 5</option>
      <option value="year6">Year 6</option>
      <option value="year7">Year 7</option>
      <option value="year8">Year 8</option>
    </select>
    </div>
  );
};
