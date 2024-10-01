<?php
use Yuvayana\Acadlix\Models\Course;

defined('ABSPATH') || exit();

global $post, $wp_version;
// $courses = Course::get();

if (version_compare($wp_version, '5.9', '>=') && function_exists('wp_is_block_theme') && wp_is_block_theme()) {
    ?>
    <!doctype html>
    <html <?php language_attributes(); ?>>

    <head>
        <meta charset="<?php bloginfo('charset'); ?>">
        <?php wp_head(); ?>
    </head>

    <body <?php body_class(); ?>>
        <?php wp_body_open(); ?>
        <div class="wp-site-blocks">
            <?php
            $theme = wp_get_theme();
            $theme_slug = $theme->get('TextDomain');
            echo do_blocks('<!-- wp:template-part {"slug":"header","theme":"' . $theme_slug . '","tagName":"header","className":"site-header","layout":{"inherit":true}} /-->');
} else {
    get_header();
}
?>

        <div class="product_details">

            <header class="Header_Productpage">
                <nav>
                    <a href="#">Home</a> > <a href="#">Development</a> > <a href="#">Web Development</a> > <a
                        href="#">Webflow</a>
                </nav>
                <h1 class="heading_productpage">Complete Website Responsive Design: from Figma to Webflow to Website
                    Design</h1>
                <p class="paragraph_productpage">3 in 1 Course: Learn to design websites with Figma, build with Webflow,
                    and make a living freelancing.</p>
                <div class="course-info">
                    <div class="course-info1">
                        <span class="bestseller">Bestseller</span>
                        <span class="rating">4.8</span>
                        <span class="star">
                            <i class="fa fa-star"></i><i class="fa fa-star"></i>
                            <i class="fa fa-star"></i><i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                        </span>
                        <span class="Ratings">(451,444 Ratings)</span>
                    </div>
                </div>
                <div class="LanguageLastupdated">
                    <span class="last-updated">Last updated 9/2024</span>
                    <span class="language">English</span>
                </div>
                <div class="creators">
                    <span class="CreatedBy">Created by</span><br />
                    <strong>Dianne Russell</strong> + <strong>Kristin Watson</strong>
                </div>
            </header>
            <div class="container">
                <div class="course-columns">
                    <div class="column">
                        <div class="content-wrapper ">
                            <div class="overview-card ">
                                <h2 class="title  ">What you will learn in this course</h2>
                                <ul class="overview-list">
                                    <i class="fa fa-check "></i>
                                    <li> You will learn how to design beautiful websites using Figma, an interface
                                        design tool used by designers at Uber, Airbnb and Microsoft.</li>
                                    <i class="fa fa-check "></i>
                                    <li> You will learn secret tips of Freelance Web Designers and how they make great
                                        money freelancing online.</li>
                                    <i class="fa fa-check "></i>
                                    <li> Understand how to use both the Jupyter Notebook and create.py files</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="column1">
                        <div class="content-wrapper ">
                            <div class="overview-card ">
                                <ul class="overview-list">
                                    <i class="fa fa-check"></i>
                                    <li>You will learn how to take your designs and build them into powerful websites
                                        using Webflow, a state of the art site builder used by teams at Dell, NASA and
                                        more.</li>
                                    <i class="fa fa-check "></i>
                                    <li> Learn to use Python professionally, learning both Python 2 and Python 3!.</li>
                                    <i class="fa fa-check "></i>
                                    <li> Get an understanding of how to create GUIs in the Jupyter Notebook system!.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="course-details">
                    <h2 class="course-details-title">Who this course is for:</h2>
                    <ul class="course-target-list">
                        <li class="course-target-item"><i class="fas fa-arrow-right"></i> This course is for those who
                            want to launch a Freelance Web Design career.</li>
                        <li class="course-target-item"><i class="fas fa-arrow-right"></i> Praesent eget consequat elit.
                            Duis a pretium purus.</li>
                        <li class="course-target-item"><i class="fas fa-arrow-right"></i> Sed sagittis suscipit
                            condimentum pellentesque.</li>
                        <li class="course-target-item"><i class="fas fa-arrow-right"></i> Sed nec dapibus orci integer
                            nisl turpis.</li>
                        <li class="course-target-item"><i class="fas fa-arrow-right"></i> Those looking to reboot their
                            work life and try a fun, rewarding, and highly in-demand profession.</li>
                        <li class="course-target-item"><i class="fas fa-arrow-right"></i> Nunc auctor consequat lorem,
                            in posuere enim hendrerit sed.</li>
                        <li class="course-target-item"><i class="fas fa-arrow-right"></i> Duis ornare enim ullamcorper
                            congue consectetur suspendisse.</li>
                    </ul>
                </div>

                <div class="course-includes">
                    <h2 class="course-includes-title">This course includes:</h2>
                    <ul class="course-includes-list">
                        <li class="course-includes-item">
                            <i class="fas fa-tv"></i>
                            <p>24 hours on-demand video</p>
                        </li>
                        <li class="course-includes-item">
                            <i class="fas fa-tasks"></i>
                            <p>Assignments</p>
                        </li>
                        <li class="course-includes-item">
                            <i class="fas fa-file-alt"></i>
                            <p>24 articles</p>
                        </li>
                        <li class="course-includes-item">
                            <i class="fas fa-download"></i>
                            <p>9 downloadable resources</p>
                        </li>
                        <li class="course-includes-item">
                            <i class="fas fa-mobile-alt"></i>
                            <p>Access on mobile and TV</p>
                        </li>
                        <li class="course-includes-item">
                            <i class="fas fa-certificate"></i>
                            <p>Certificate of completion</p>
                        </li>
                    </ul>
                </div>
                <div class="TopCompanies">
                    <h3>Top Companies offer this course to their employees</h3>
                </div>
                <div class="Description">
                    <h2 class="Description_heading">Description</h2>
                    <p class="Description_paragraph">Learn how to create a complete, responsive website from start to
                        finish using Figma for design, Webflow for development, and modern web design best practices.
                    </p>

                    <p class="Description_paragraph">In this course, you'll master the entire process of turning a
                        concept into a fully functional, visually stunning website. You'll begin by designing a
                        responsive layout in Figma, a powerful and intuitive design tool. From there, you'll seamlessly
                        transition to Webflow, where you'll bring your design to life without needing to write a single
                        line of code.</p>

                    <p class="Description_paragraph">Whether you're a beginner or looking to streamline your workflow,
                        this course will equip you with the skills to design and build professional-quality websites
                        that look great on any device. By the end, you'll have a polished, responsive website that's
                        ready to impress clients and users alike.</p>

                    <p class="Description_paragraph">For example, this is a Design course but I don't teach you
                        Photoshop. Because Photoshop is needlessly complicated for Web Design. But people still teach it
                        to web designers. I don't. I teach Figma - a simple tool that is taking over the design world.
                        You will be designing a complete website within a week while others are still learning how to
                        create basic layouts in Photoshop.</p>

                    <p class="Description_paragraph">Second, this is a Development course. But I don't teach you how to
                        code. Because for Web Design coding is needlessly complicated and takes too long to learn.
                        Instead, I teach Webflow-a tool that is taking over the web design world. You will be building
                        complex websites within two weeks while others are still learning the basics of HTML & CSS.</p>

                    <p class="Description_paragraph">Third, this is a Freelancing course. But I don't just teach you how
                        to write great proposals. I give you a winning proposal template. When you're done with the
                        course, you will have a stunning portfolio website with portfolio pieces already in it.</p>

                    <p class="Description_paragraph">Join now and take the first step towards becoming a complete web
                        designer!</p>

                </div>
                <div class="curriculum-container">
                    <h2 class="curriculum-title">Curriculum</h2>
                    <div class="curriculum-info">
                        <span><i class="icon">&#128193;</i> 6 Sections</span>
                        <span><i class="icon">&#128340;</i> 202 lectures</span>
                        <span><i class="icon">&#128337;</i> 19h 37m</span>
                    </div>

                    <!-- Section 1 -->
                    <div class="curriculum-section">
                        <input type="checkbox" id="section1" class="dropdown-toggle">
                        <label for="section1" class="section-header">
                            <span class="section-title">Getting Started</span>
                            <div class="section-info">
                                <span>4 lectures</span> • <span>51m</span>
                                <span class="arrow">&#9650;</span>
                            </div>
                        </label>
                        <ul class="lecture-list">
                            <li>What's is Webflow?</li>
                            <li>Sign up in Webflow</li>
                            <li>Webflow Terms & Conditions</li>
                            <li>Teaser of Webflow</li>
                            <li>Practice Project</li>
                        </ul>
                    </div>

                    <!-- Section 2 -->
                    <div class="curriculum-section">
                        <input type="checkbox" id="section2" class="dropdown-toggle">
                        <label for="section2" class="section-header">
                            <span class="section-title">Secret of Good Design</span>
                            <div class="section-info">
                                <span>52 lectures</span> • <span>5h 49m</span>
                                <span class="arrow">&#9660;</span>
                            </div>
                        </label>
                        <ul class="lecture-list">
                            <li>Introduction to Design</li>
                            <li>Color Theory</li>
                            <li>Typography</li>
                        </ul>
                    </div>

                    <!-- Add more sections as needed -->
                </div>

            </div>
            <div class="course-container">
                <h2 class="section-heading">Course Instructor (02)</h2>

                <!-- Instructor Card 1 -->
                <div class="instructor-card">
                    <div class="instructor-info">
                        <img src="vako.jpg" alt="Vako Shvili" class="instructor-photo">
                        <div class="instructor-details">
                            <h3>Vako Shvili</h3>
                            <p>Web Designer & Best-Selling Instructor</p>
                            <div class="stats">
                                <span>⭐ 4.9 Course Rating</span> |
                                <span>👥 236,568 Students</span> |
                                <span>🎓 09 Courses</span>
                            </div>
                            <p>One day Vako had enough with the 9-to-5 grind... <a href="#">READ MORE</a></p>
                        </div>
                    </div>
                </div>

                <!-- Instructor Card 2 -->
                <div class="instructor-card">
                    <div class="instructor-info">
                        <img src="nima.jpg" alt="Nima Tahami" class="instructor-photo">
                        <div class="instructor-details">
                            <h3>Nima Tahami</h3>
                            <p>Entrepreneur & Designer • Founder of ShiftRide</p>
                            <div class="stats">
                                <span>⭐ 4.6 Course Rating</span> |
                                <span>👥 5,342 Students</span> |
                                <span>🎓 01 Courses</span>
                            </div>
                            <p>I'm an entrepreneur & designer... <a href="#">READ MORE</a></p>
                        </div>
                    </div>
                </div>

                <!-- Course Rating Section -->
                <h2 class="section-heading">Course Rating</h2>
                <div class="rating-section">
                    <div class="rating-score">
                        <h1>4.8</h1>
                        <p>⭐ Course Rating</p>
                    </div>
                    <div class="rating-bars">
                        <div class="rating-row">
                            <span>⭐ 5 Star Rating</span>
                            <div class="bar">
                                <div class="fill" style="width: 75%;"></div>
                            </div>
                            <span>75%</span>
                        </div>
                        <div class="rating-row">
                            <span>⭐ 5 Star Rating</span>
                            <div class="bar">
                                <div class="fill" style="width: 75%;"></div>
                            </div>
                            <span>75%</span>
                        </div>
                        <div class="rating-row">
                            <span>⭐ 4 Star Rating</span>
                            <div class="bar">
                                <div class="fill" style="width: 21%;"></div>
                            </div>
                            <span>21%</span>
                        </div>
                        <div class="rating-row">
                            <span>⭐ 3 Star Rating</span>
                            <div class="bar">
                                <div class="fill" style="width: 3%;"></div>
                            </div>
                            <span>3%</span>
                        </div>
                        <div class="rating-row">
                            <span>⭐ 2 Star Rating</span>
                            <div class="bar">
                                <div class="fill" style="width: 1%;"></div>
                            </div>
                            <span>1%</span>
                        </div>
                        <div class="rating-row">
                            <span>⭐ 1 Star Rating</span>
                            <div class="bar">
                                <div class="fill" style="width: 0.5%;"></div>
                            </div>
                            <span>&lt;1%</span>
                        </div>
                    </div>
                </div>
            </div>
            <section class="feedback-section">
                <h1 class="section-title">Students Feedback</h1>
                <div class="feedback-card">
                    <div class="feedback-header">
                        <img src="https://via.placeholder.com/50" alt="User 1">
                        <div class="feedback-info">
                            <h3>Guy Hawkins</h3>
                            <p>1 week ago</p>
                        </div>
                    </div>
                    <p>⭐⭐⭐⭐⭐</p>
                    <p>I appreciate the precise short videos (10 mins or less each) because overly long videos tend to
                        make me lose focus. The instructor is very knowledgeable in Web Design and it shows as he shares
                        his knowledge. These were my best 6 months of training. Thanks, Vako.</p>
                </div>

                <div class="feedback-card">
                    <div class="feedback-header">
                        <img src="https://via.placeholder.com/50" alt="User 2">
                        <div class="feedback-info">
                            <h3>Dianne Russell</h3>
                            <p>51 mins ago</p>
                        </div>
                    </div>
                    <p>⭐⭐⭐⭐⭐</p>
                    <p>This course is just amazing! It has great course content, best practices, and a lot of real-world
                        knowledge. I love the way of giving examples, the best tips by the instructor which are pretty
                        interesting, fun, and knowledgeable...</p>
                </div>

                <div class="feedback-card">
                    <div class="feedback-header">
                        <img src="https://via.placeholder.com/50" alt="User 3">
                        <div class="feedback-info">
                            <h3>Bessie Cooper</h3>
                            <p>6 hours ago</p>
                        </div>
                    </div>
                    <p>⭐⭐⭐⭐⭐</p>
                    <p>Webflow course was good, it covers design secrets, and to build responsive web pages, blog, and
                        some more tricks and tips about Webflow. I enjoyed the course...</p>
                </div>

                <div class="feedback-card">
                    <div class="feedback-header">
                        <img src="https://via.placeholder.com/50" alt="User 4">
                        <div class="feedback-info">
                            <h3>Eleanor Pena</h3>
                            <p>1 day ago</p>
                        </div>
                    </div>
                    <p>⭐⭐⭐⭐⭐</p>
                    <p>I appreciate the precise short videos (10 mins or less each) because overly long videos tend to
                        make me lose focus. The instructor is very knowledgeable in Web Design...</p>
                </div>

                <button class="load-more-btn">Load More</button>
            </section>

            <section class="related-courses">
                <h2>Related Courses</h2>
                <div class="course-card">
                    <img src="https://via.placeholder.com/200" alt="Course 1">
                    <h3>Machine Learning A-Z™</h3>
                    <p>$57</p>
                </div>
                <div class="course-card">
                    <img src="https://via.placeholder.com/200" alt="Course 2">
                    <h3>The Complete 2021 Web Development Bootcamp</h3>
                    <p>$57</p>
                </div>
                <div class="course-card">
                    <img src="https://via.placeholder.com/200" alt="Course 3">
                    <h3>Learn Python Programming Masterclass</h3>
                    <p>$57</p>
                </div>
                <div class="course-card">
                    <img src="https://via.placeholder.com/200" alt="Course 4">
                    <h3>The Complete Digital Marketing Course</h3>
                    <p>$57</p>
                </div>
            </section>

        </div>
        <?php

        if (version_compare($wp_version, '5.9', '>=') && function_exists('wp_is_block_theme') && true === wp_is_block_theme()) {
            $theme = wp_get_theme();
            $theme_slug = $theme->get('TextDomain');
            echo do_blocks('<!-- wp:template-part {"slug":"footer","theme":"' . $theme_slug . '","tagName":"footer","className":"site-footer","layout":{"inherit":true}} /-->');
            echo '</div>';
            wp_footer();
            echo '</body>';
            echo '</html>';
        } else {
            get_footer();
        }