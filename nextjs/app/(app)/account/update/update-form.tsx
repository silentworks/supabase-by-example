"use client";
import { useActionState } from "react";
import { UserInfo, initialFormState } from "@/lib/utils";
import Alert from "@/components/Alert";
import InputErrorMessage from "@/components/InputErrorMessage";
import get from "just-safe-get";
import { update } from "../actions";

export default function UpdateForm({ user, profile }: UserInfo) {
  const [state, formAction] = useActionState(update, initialFormState())
  const profileInfo = get(profile as Profile, "profiles_info") as ProfileInfo;

  return (
    <div className="w-11/12 p-12 px-6 py-10 rounded-lg sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-3/12 sm:px-10 sm:py-6">
      {state.message ? (
        <Alert
          className={`${state.success ? "alert-info" : "alert-error"} mb-10`}
        >
          {state.message}
        </Alert>
      ) : null}
      <h2 className="font-semibold text-4xl mb-4">
        {profile?.display_name
          ? "Update Profile"
          : "Please complete your profile"}
      </h2>
      <p className="font-medium mb-4">
        Hi {profile?.display_name ?? user?.email}, Enter your user profile info
        below
      </p>
      <form action={formAction}>
        <div className="form-control">
          <label htmlFor="first_name" className="label">
            First Name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            defaultValue={profileInfo?.first_name ?? ""}
            className="input input-bordered"
          />
        </div>
        {!state.success && state.errors?.firstName ? (
          <InputErrorMessage>{state.errors.firstName}</InputErrorMessage>
        ) : null}
        <div className="form-control">
          <label htmlFor="last_name" className="label">
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            defaultValue={profileInfo.last_name ?? ""}
            className="input input-bordered"
          />
        </div>
        {!state.success && state.errors?.lastName ? (
          <InputErrorMessage>{state.errors.lastName}</InputErrorMessage>
        ) : null}
        <div className="form-control">
          <label htmlFor="display_name" className="label">
            Display Name
          </label>
          <input
            id="display_name"
            name="display_name"
            type="text"
            defaultValue={profile.display_name ?? ""}
            className="input input-bordered"
          />
        </div>
        {!state.success && state.errors?.displayName ? (
          <InputErrorMessage>{state.errors.displayName}</InputErrorMessage>
        ) : null}
        <div className="form-control">
          <label htmlFor="bio" className="label">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            className="textarea textarea-bordered textarea-lg w-full"
            defaultValue={profile.bio ?? ""}
          />
        </div>
        {!state.success && state.errors?.bio ? (
          <InputErrorMessage>{state.errors.bio}</InputErrorMessage>
        ) : null}
        <div className="form-control">
          <label htmlFor="dob" className="label">
            Date of birth
          </label>
          <input
            id="dob"
            name="dob"
            type="text"
            defaultValue={profileInfo.dob ?? ""}
            className="input input-bordered"
          />
        </div>
        {!state.success && state.errors?.dob ? (
          <InputErrorMessage>{state.errors.dob}</InputErrorMessage>
        ) : null}
        <div className="form-control">
          <label htmlFor="profile_location" className="label">
            Location
          </label>
          <input
            id="profile_location"
            name="profile_location"
            type="text"
            defaultValue={profileInfo.profile_location ?? ""}
            className="input input-bordered"
          />
        </div>
        {!state.success && state.errors?.profileLocation ? (
          <InputErrorMessage>{state.errors.profileLocation}</InputErrorMessage>
        ) : null}
        <div className="form-control mt-6">
          <button className="btn btn-primary no-animation">Update</button>
        </div>
      </form>
    </div>
  );
}
